from django.core.validators import RegexValidator
from studios.models import Studio
from django import forms
from studios.studio_manager import populate_studio_services


class StudioSelectWidget(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class StudioStaffSignUpForm(forms.Form):
    email = forms.CharField(label='Email', max_length=255, required=True)
    password = forms.CharField(label='Password', max_length=255, widget=forms.PasswordInput, required=True)
    studios = StudioSelectWidget(label='Home studio', queryset=None, empty_label='- Select home studio -',
                                 required=True, to_field_name='api_studio_id')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['studios'].queryset = Studio.objects.all()
        self.fields['studios'].widget.attrs['ng-model'] = 'studio'


class StudioStaffSignInForm(StudioStaffSignUpForm):
    def __init__(self, *args, **kwargs):
        super(StudioStaffSignInForm, self).__init__(*args, **kwargs)

        for field in self.fields.values():
            field.error_messages = {'required': '{fieldname} is required'.format(
                fieldname=field.label)}
