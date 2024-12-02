import logging

from django.views.generic import TemplateView
from django.shortcuts import redirect
from accounts.staff import Staff


class BookingsView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'bookings/bookings.html'

    def get_context_data(self, **kwargs):
        context = super(BookingsView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated() or not request.user.is_superuser:
            return redirect('studio_home')
        return super(BookingsView, self).dispatch(request, *args, **kwargs)


class InternalBookingsView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'bookings/internal-bookings.html'

    def get_context_data(self, **kwargs):
        context = super(InternalBookingsView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        user = self.request.user
        staff = Staff(user)
        context['studio'] = staff.get_studio().name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(InternalBookingsView, self).dispatch(request, *args, **kwargs)


class ExternalBookingsView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'bookings/external-bookings.html'

    def get_context_data(self, **kwargs):
        context = super(ExternalBookingsView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        user = self.request.user
        staff = Staff(user)
        context['studio'] = staff.get_studio().name
        return context

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return redirect('studio_home')
        return super(ExternalBookingsView, self).dispatch(request, *args, **kwargs)
