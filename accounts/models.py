from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_active, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email,
                          is_active=is_active,
                          is_superuser=is_superuser,
                          last_login=now,
                          date_joined=now,
                          **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, is_active=True, **extra_fields):
        return self._create_user(email, password, is_active, False **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True, **extra_fields)

    def get_user_by_email(self, email):
        return self.filter(email=email).first()


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    """
    A User of the system
    """
    first_name = models.CharField('first name', max_length=30)
    last_name = models.CharField('last name', max_length=30)
    email = models.EmailField(verbose_name='email address',
                              max_length=255,
                              unique=True)
    is_active = models.BooleanField('active', default=True)
    date_joined = models.DateTimeField('date joined', default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_full_name(self):
        """
        The user is identified by their email address
        """
        return self.email

    def get_short_name(self):
        """
        The user is identified by their email address
        """
        return self.email

    def get_username(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_superuser

    def __str__(self):
        return self.email

    def update_password(self, password):
        self.set_password(password)
        self.save()


class UserAccountManager(models.Manager):
    def save(self, user, account_name, account_number, sort_code):
        user_account = self.model(user=user, account_name=account_name, account_number=account_number, sort_code=sort_code)
        user_account.save()
        return user_account

    def get_user_account_by_user(self, user):
        user_account = self.filter(user=user).first()
        return user_account


class UserAccount(models.Model):
    user = models.ForeignKey(User)
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=255)
    sort_code = models.CharField(max_length=255)

    objects = UserAccountManager()

    def update(self, account_name, account_number, sort_code):
        self.account_name = account_name
        self.account_number = account_number
        self.sort_code = sort_code
        self.save()
