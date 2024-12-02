from django.conf.urls import url
from accounts.ajax_views import UserListView, GetUserAccountView
from accounts.views import LoginView, ChangePasswordTemplateView, ChangePasswordView, AccountsView, UserAccountView

urlpatterns = [
    url(r'login$', LoginView.as_view()),
    url(r'^profile$', ChangePasswordTemplateView.as_view(), name='profile_view'),
    url(r'^change-password$', ChangePasswordView.as_view()),
    url(r'^account$', AccountsView.as_view(), name='account'),
    url(r'^users$', UserListView.as_view(), name='user-list'),
    url(r'user/account$', UserAccountView.as_view()),
    url(r'get/user-account/$', GetUserAccountView.as_view()),

]
