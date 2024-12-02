from django.db import models


class StudioManager(models.Manager):
    def get_studio_by_mbo_site_id(self, mbo_site_id):
        return self.filter(mbo_site_id=mbo_site_id).first()


class Studio(models.Model):
    name = models.CharField('Name', max_length=255)
    api_studio_id = models.IntegerField(blank=True, null=True)
    description = models.TextField()
    contact_email = models.EmailField(max_length=255, null=True)
    is_mbo_studio = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    objects = StudioManager()

    def __str__(self):
        return self.name
