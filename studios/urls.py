from django.conf.urls import url
from studios.views import StudioStaffSignUpView, StudioHome, StudioStaffLoginView, ClassListView, ClassDelete, \
    AjaxClassListView, ManageExternalCreditsView, ManageExternalStudiosView, StudioPricingView
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', StudioHome.as_view(), name="studio_home"),
    url(r'^signup/$', StudioStaffSignUpView.as_view(), name="studio_staff_signup"),
    url(r'^login/$', StudioStaffLoginView.as_view(), name="studio_staff_login"),
    url(r'^classes/date/(?P<date>[\w\-]+)$', ClassListView.as_view(), name='studio_classes_delete'),
    url(r'^classes', ClassListView.as_view(), name='studio_classes'),
    url(r'^class-list/', AjaxClassListView.as_view(), name='ajax_class_list'),
    url(r'^manage/external/credits', ManageExternalCreditsView.as_view(), name='manage_external_credits'),
    url(r'^logout', auth_views.logout, kwargs={'next_page': '/'}, name="studio_staff_logout"),
    url(r'^manage/external/studios', ManageExternalStudiosView.as_view(), name="manage_external_studios"),
    url(r'^price', StudioPricingView.as_view(), name="studio_pricing"),
]
