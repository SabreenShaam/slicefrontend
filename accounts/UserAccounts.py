from accounts import models


class UserAccounts(object):
    def __init__(self, request):
        self.request = request

    def save(self):
        user_account = self.get_user_account(self.request.user)
        if not user_account:
            models.UserAccount.objects.save(self.request.user, self.request.data['accountName'], self.request.data['accountNum'], self.request.data['sortCode'])
            return
        user_account.update(self.request.data['accountName'], self.request.data['accountNum'], self.request.data['sortCode'])

    @staticmethod
    def get_user_account(user):
        user_account = models.UserAccount.objects.get_user_account_by_user(user)
        if user_account:
            return user_account
        else:
            return
