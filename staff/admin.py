from django.contrib import admin
from staff.models import Staff


class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'studio')

admin.site.register(Staff, StaffAdmin)
