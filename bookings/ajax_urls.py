from django.conf.urls import url
from accounts.ajax_views import UserListView
from accounts.views import LoginView, ChangePasswordTemplateView, ChangePasswordView, AccountsView
from bookings.ajax_views import BookingListView

urlpatterns = [

    url(r'^booking-list$', BookingListView.as_view(), name='booking-list')
]
