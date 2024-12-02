import json
import logging
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views.generic import View, TemplateView
from django.contrib.auth import authenticate, login, update_session_auth_hash


# Create your views here.
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.UserAccounts import UserAccounts
from accounts.staff import Staff


class LoginView(View):
    logger = logging.getLogger(__name__)

    def post(self, request):
        self.logger.info("Entered into LoginView")
        response_data = {}
        data = json.loads(request.body.decode("utf-8"))

        email = data['email']
        password = data['password']

        try:
            user = authenticate(username=email, password=password)
            if user:
                if not user.is_superuser:
                    staff = Staff(user)

                    staff.validate()
                self.logger.info("User with email {} is logged in".format(email))
            else:
                raise Exception("User does not exist with the given username password combination")

        except Exception as e:
            response_data['code'] = 400
            response_data['message'] = e.args[0]
            self.logger.error(e.args[0])
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        login(request, user)
        response_data['message'] = "Success"
        response_data['code'] = 200
        self.logger.info("Leaving from LoginView")
        return HttpResponse(json.dumps(response_data), content_type='application/json')


class ChangePasswordTemplateView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'accounts/change-password.html'
    initial = {'studio': None}

    def get_context_data(self, **kwargs):
        self.logger.info("Entered into ChangePasswordTemplateView")
        context = super(ChangePasswordTemplateView, self).get_context_data(**kwargs)
        user = self.request.user
        staff = Staff(user)
        studio_name = staff.get_studio().name
        context['studio'] = studio_name
        return context

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(ChangePasswordTemplateView, self).dispatch(*args, **kwargs)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)
    logger = logging.getLogger(__name__)

    def post(self, request, format=None):
        self.logger.info("Entered into ChangePasswordView")
        if request.data:
            password = request.data['password']
            user = self.request.user
            user.update_password(password)
            update_session_auth_hash(request, user)
            self.logger.info("Password is updated for user {}".format(self.request.user.email))
            self.logger.info("Leaving ChangePasswordView")
        return Response(status=status.HTTP_200_OK)


class AccountsView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'accounts/account.html'

    def get_context_data(self, **kwargs):
        context = super(AccountsView, self).get_context_data(**kwargs)
        staff = Staff(self.request.user)
        studio_name = staff.get_studio().name
        context['studio'] = studio_name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(AccountsView, self).dispatch(request, *args, **kwargs)


class AdminHomeView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'accounts/admin-dashboard.html'

    def get_context_data(self, **kwargs):
        context = super(AdminHomeView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or not request.user.is_superuser:
            return redirect('studio_home')
        return super(AdminHomeView, self).dispatch(request, *args, **kwargs)


class UserAccountView(APIView):
    logger = logging.getLogger(__name__)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        self.logger.info("Entered into UserAccountView")
        response_data = {}

        user_account = UserAccounts(request)
        user_account.save()

        response_data['message'] = "Success"
        response_data['code'] = 200
        self.logger.info("Leaving from UserAccountView")
        return HttpResponse(json.dumps(response_data), content_type='application/json')


class UserGuideView(TemplateView):
    template_name = 'accounts/user_guide.html'

    def get_context_data(self, **kwargs):
        context = super(UserGuideView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        user = self.request.user
        staff = Staff(user)
        context['studio'] = staff.get_studio().name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or request.user.is_superuser:
            return redirect('studio_home')
        return super(UserGuideView, self).dispatch(request, *args, **kwargs)


class FaqView(TemplateView):
    template_name = 'accounts/faq.html'

    def get_context_data(self, **kwargs):
        context = super(FaqView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        user = self.request.user
        staff = Staff(user)
        context['studio'] = staff.get_studio().name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or request.user.is_superuser:
            return redirect('studio_home')
        return super(FaqView, self).dispatch(request, *args, **kwargs)
