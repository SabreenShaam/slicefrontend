import logging
import json
from django.http import HttpResponse
from django.views.generic import TemplateView, View
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from slicerepublic.slice_api_manager import get_user_list


class UserListView(TemplateView):
    logger = logging.getLogger(__name__)
    template_name = 'accounts/users.html'

    def get_context_data(self, **kwargs):
        context = super(UserListView, self).get_context_data(**kwargs)
        context['email'] = self.request.user.email
        return context


class UserSearchListView(View):
    logger = logging.getLogger(__name__)

    def post(self, request):
        response_data = {}
        mstring = []
        data = json.loads(request.body.decode("utf-8"))
        for key, value in data.items():
            if value:
                mstring.extend(['%s=%s' % (key, value)])

        query_string = '&'.join(mstring)
        response = get_user_list(query_string)
        if response.status_code == 200:
            response_data['users'] = json.loads(response.text)
        return HttpResponse(json.dumps(response_data), content_type='application/json')


class GetUserAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        response_data = {}
        from accounts import UserAccounts
        user_account = UserAccounts.UserAccounts.get_user_account(request.user)

        response_data['acc_name'] = user_account.account_name
        response_data['acc_num'] = user_account.account_number
        response_data['sort_code'] = user_account.sort_code
        return HttpResponse(json.dumps(response_data), content_type='application/json')
