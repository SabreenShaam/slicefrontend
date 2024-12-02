from django.conf.urls import url
from accounts.ajax_views import UserSearchListView
from studios.ajax_views import StudioAccessListView, StudioAccessView, UserListView, StudioListView, \
    ExternalCreditsView, \
    UpdateCreditsView, ClassListView, ClassCancellationView, PassportStudioAccessView, StudioPriceListView

urlpatterns = [
    url(r'^access-list$', StudioAccessListView.as_view()),
    url(r'^access/(?P<ext_studio_id>\d+)$', StudioAccessView.as_view()),
    url(r'^user-list$', UserListView.as_view()),
    url(r'^users-list/search$', UserSearchListView.as_view(), name='user-search-list'),
    url(r'^studio-list$', StudioListView.as_view()),
    url(r'^price$', StudioPriceListView.as_view()),
    url(r'^service-list$', ExternalCreditsView.as_view()),
    url(r'^update/service-list$', UpdateCreditsView.as_view()),
    url(r'^class-list$', ClassListView.as_view()),
    url(r'^class/(?P<pk>\d+)/cancel$', ClassCancellationView.as_view(), name='server_delete'),
    url(r'^passport/(?P<pk>\d+)/studio-list$', PassportStudioAccessView.as_view()),
]
