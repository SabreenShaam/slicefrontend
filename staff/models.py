from accounts.models import User
from django.db import models
from studios.models import Studio


class StaffManager(models.Manager):
    def get_staff_by_user_id(self, user_id):
        return self.filter(user_id=user_id).first()


class Staff(models.Model):
    user = models.ForeignKey(User)
    studio = models.ForeignKey(Studio)

    objects = StaffManager()

