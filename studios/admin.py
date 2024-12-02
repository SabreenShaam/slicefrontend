from django.contrib import admin
from studios.models import Studio


class StudioAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.save()

admin.site.register(Studio, StudioAdmin)

