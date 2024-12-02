from django.conf.urls import url
from bookings.views import BookingsView, ExternalBookingsView, InternalBookingsView

urlpatterns = [
    url(r'^$', BookingsView.as_view(), name='bookings'),
    url(r'^external$', ExternalBookingsView.as_view(), name='external_bookings'),
    url(r'^internal$', InternalBookingsView.as_view(), name='internal_bookings'),
]
