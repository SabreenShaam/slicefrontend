from datetime import datetime
import hashlib
import json
import logging
from rest_framework.permissions import IsAuthenticated
from staff import models

from accounts.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.core.urlresolvers import reverse
from django.forms.utils import ErrorList
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic import FormView, TemplateView, ListView, DeleteView
from accounts.forms import StudioStaffSignUpForm, StudioStaffSignInForm
from accounts.staff import Staff

from slicerepublic import dateutil
from slicerepublic.dateutil import utcnow_millis
from slicerepublic.sendmail import send_studio_staff_signup_verification_mail
from slicerepublic.slice_api_manager import check_valid_mbo_staff, get_all_classes_by_studio, cancel_class, \
    save_mbo_service, get_mbo_service, get_available_studio_services

from django.contrib.auth import login
from django.http import *
from django.shortcuts import redirect

from studios.studio_manager import populate_studio_services, pre_populate_external_credit_items
from django.conf import settings


class StudioHome(TemplateView):
    template_name = 'studios/home.html'

    def get_context_data(self, **kwargs):
        context = super(StudioHome, self).get_context_data(**kwargs)
        context['form'] = StudioStaffSignInForm()
        return context

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            if request.user.is_staff:
                return redirect('admin-home')
            else:
                return redirect('studio_classes')
        return super(StudioHome, self).dispatch(request, *args, **kwargs)


class StudioStaffSignUpView(SuccessMessageMixin, FormView):
    logger = logging.getLogger(__name__)
    template_name = 'studios/studio_staff_signup.html'
    form_class = StudioStaffSignUpForm
    success_url = '/signup/'

    def form_valid(self, form):
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            home_studio = form.cleaned_data.get('studios')
            hash_object = hashlib.md5(bytes(str(utcnow_millis()), encoding='utf-8'))

            count = User.objects.get_count_by_email(email=email)

            if count == 1:
                errors = form._errors.setdefault('__all__', ErrorList())
                self.logger.error('User with the name already exists.')
                errors.append('User with the name already exists.')
                return self.form_invalid(form)
            try:
                response = check_valid_mbo_staff(email, password, str(home_studio.id))

                if not response.ok:
                    if response.status_code == 403:
                        message = json.loads(response.text)['long_message']
                        messages.error(self.request, message)
                        self.logger.error(message)
                        return super(StudioStaffSignUpView, self).form_valid(form)
            except ConnectionError as error:
                message = error
                messages.error(self.request, message)
                self.logger.error(message)
                return super(StudioStaffSignUpView, self).form_valid(form)

            user = User.objects.create(email=email,
                                       is_active=False,
                                       verification_hash=hash_object.hexdigest())
            self.logger.info("User created for email {}".format(user.email))
            staff = Staff(user=user, studio=home_studio)
            staff.save()
            self.logger.info("Staff created for user {}".format(user.email))
            host_name = settings.SIGNUP_VERIFICATION_HOST_NAME
            send_studio_staff_signup_verification_mail(host_name, email, hash_object.hexdigest,
                                                       home_studio.contact_email)

            print(hash_object.hexdigest())
            success_message = "Your account has been made, owner needs to verify it by clicking the activation link " \
                              "that has been sent to his email."
            messages.add_message(self.request, messages.SUCCESS, success_message)
            return super(StudioStaffSignUpView, self).form_valid(form)


class StudioStaffLoginView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'home.html'
    form_class = StudioStaffSignInForm
    success_url = '/signup/'
    initial = {'key': None}

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        response_data = {}
        email = request.POST['email']
        password = request.POST['password']
        studio = request.POST['studio']

        user = User.objects.get_user_by_email(email)
        if not user:
            response_data['code'] = 400
            response_data['message'] = 'Invalid email or password'
            self.logger.error('Invalid email or password')
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        if not user.is_active:
            response_data['code'] = 400
            response_data['message'] = 'Pending verification by the owner of the studio.'
            self.logger.error('Pending verification by the owner of the studio.')
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        if not request.user.is_authenticated():
            try:
                response = check_valid_mbo_staff(email, password, str(studio))
                if response:
                    if not response.ok:
                        if response.status_code == 403:
                            message = json.loads(response.text)['long_message']
                            response_data['code'] = 400
                            response_data['message'] = message
                            self.logger.error(message)
                            return HttpResponse(json.dumps(response_data), content_type="application/json")
                else:
                    message = 'Something went wrong in server response'
                    response_data['code'] = 400
                    response_data['message'] = message
                    self.logger.error(message)
                    return HttpResponse(json.dumps(response_data), content_type="application/json")
            except ConnectionError as error:
                response_data['code'] = 400
                response_data['message'] = error
                self.logger.error(error)
                return HttpResponse(json.dumps(response_data), content_type="application/json")

            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            response_data['code'] = 200
            return HttpResponse(json.dumps(response_data), content_type="application/json")


class ClassListView(TemplateView):
    template_name = "studios/class_list.html"
    # context_object_name = "classes"
    # # paginate_by = 10
    # user = None
    #
    # def get_queryset(self):
    #     user = self.request.user
    #
    #     if not self.kwargs:
    #         current_datetime = dateutil.get_local_datetime(dateutil.utcnow(), "Europe/London")
    #         date = str(current_datetime.year) + "-" + str(current_datetime.month) + "-" + str(current_datetime.day)
    #     else:
    #         date = self.kwargs['date']
    #
    #     staff = models.Staff.objects.get_staff_by_user_id(user.id)
    #
    #     response = get_all_classes_by_studio(staff.studio.id, date)
    #     if response.ok:
    #         lists = json.loads(response.text)
    #         for item in lists:
    #             item['start_time'] = datetime.strptime(item['start_time'], "%H:%M:%S")
    #             item['end_time'] = datetime.strptime(item['end_time'], "%H:%M:%S")
    #     return lists
    #
    def get_context_data(self, **kwargs):
        context = super(ClassListView, self).get_context_data(**kwargs)
        user = self.request.user
        staff = Staff(user)
        studio_name = staff.get_studio().name
        context['studio'] = studio_name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(ClassListView, self).dispatch(request, *args, **kwargs)


class ClassDelete(DeleteView):
    logger = logging.getLogger(__name__)

    def get(self, *a, **kw):
        self.logger.info("Entered into ClassDelete View")
        class_id = kw['pk']
        cancel_class(class_id)
        self.logger.info("Deleted class with id {}".format(class_id))
        url = reverse('studio_classes_delete', kwargs={'date': kw['date']})
        self.logger.info("Leaving ClassDelete View")
        return HttpResponseRedirect(url)


class AjaxClassListView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'studios/classlist_datepicker.html'
    initial = {'key': None}

    def get(self, request, *args, **kwargs):
        self.logger.error("Entered into AjaxClassListView")
        user = self.request.user
        if request.GET:
            date = self.request.GET['search_date'].split('/')
            date = str(date[2]) + "-" + str(date[0]) + "-" + str(date[1])
            staff = models.Staff.objects.get_staff_by_user_id(user.id)
            response = get_all_classes_by_studio(staff.studio.id, date)  # TO DO: need to do
            lists = json.loads(response.text)
            response = {}
            response['response_list'] = lists
            self.logger.error("Leaving AjaxClassListView")
            return HttpResponse(json.dumps(response), content_type='application/json')


class ViewBookingList(ListView):
    logger = logging.getLogger(__name__)
    permission_classes = (IsAuthenticated,)
    template_name = "bookings/bookings.html"
    context_object_name = "bookings"
    paginate_by = 10

    def get_queryset(self):
        self.logger.error("Entered into ViewBookingList")
        user = self.request.user

        if not self.kwargs:
            datetime = dateutil.get_local_datetime(dateutil.utcnow(), "Europe/London")
            date = str(datetime.year) + "-" + str(datetime.month) + "-" + str(datetime.day)
        else:
            date = self.kwargs['date']

        staff = models.Staff.objects.get_staff_by_user_id(user.id)

        response = get_all_classes_by_studio(staff.studio.id, date)  # TO DO: need to do

        return response.text

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(ClassListView, self).dispatch(*args, **kwargs)


class ManageExternalCreditsView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'studios/credit-management.html'

    def get_context_data(self, **kwargs):
        context = super(ManageExternalCreditsView, self).get_context_data(**kwargs)
        staff = Staff(self.request.user)
        studio_name = staff.get_studio().name
        context['studio'] = studio_name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(ManageExternalCreditsView, self).dispatch(request, *args, **kwargs)


# class ManageExternalStudiosView(TemplateView):
#     logger = logging.getLogger(__name__)
#     template_name = 'studios/manage_external_studios.html'
#
#     def get_context_data(self, **kwargs):
#         context = super(ManageExternalStudiosView, self).get_context_data(**kwargs)
#         staff = Staff(self.request.user)
#         studio_name = staff.get_studio().name
#         context['studio'] = studio_name
#         return context
#
#     def dispatch(self, request, *args, **kwargs):
#         if not request.user.is_authenticated():
#             return redirect('studio_home')
#         return super(ManageExternalStudiosView, self).dispatch(request, *args, **kwargs)


class ManageExternalStudiosView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'studios/manage_passport_accessible_studios.html'

    def get_context_data(self, **kwargs):
        context = super(ManageExternalStudiosView, self).get_context_data(**kwargs)
        staff = Staff(self.request.user)
        studio_name = staff.get_studio().name
        context['studio'] = studio_name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(ManageExternalStudiosView, self).dispatch(request, *args, **kwargs)


class StudioPricingView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'studios/studio_price_page.html'

    def get_context_data(self, **kwargs):
        context = super(StudioPricingView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(StudioPricingView, self).dispatch(request, *args, **kwargs)
