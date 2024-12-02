from accounts.models import User


class BasicBackend:
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise Exception('User not exist')


class EmailBackend(BasicBackend):
    def authenticate(self, username=None, password=None):
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            raise Exception('User not exist')

        if user.check_password(password):
            return user
