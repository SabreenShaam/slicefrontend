from django.conf.urls import url
from accounts.views import AdminHomeView, UserGuideView,FaqView

urlpatterns = [
    url(r'^admin$', AdminHomeView.as_view(), name='admin-home'),
    url(r'^user-guide$', UserGuideView.as_view(), name='user_guide'),
    url(r'^faq$', FaqView.as_view(), name='faq')
]
