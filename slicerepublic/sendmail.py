from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from django.utils.html import strip_tags


def send_booking_confirmation_mail_member(booking):
    _send_mail(
        subject='Booking confirmed for {} on {}'.format(booking.slice_class.name, booking.slice_class.start_date),
        sender=settings.EMAIL_SLICE_REPUBLIC_FROM,
        receiver=booking.user.email,
        template_name='booking_confirmation_member',
        context={'booking': booking},
    )


def send_booking_cancellation_mail_member(booking, cancelled_by, cancelled_date):
    _send_mail(
        subject='Cancellation of booking for {} on {}'.format(booking.slice_class.name, booking.slice_class.start_date),
        sender=settings.EMAIL_SLICE_REPUBLIC_FROM,
        receiver=booking.user.email,
        template_name='booking_cancellation_member',
        context={'booking': booking, 'cancelled_by': cancelled_by, 'cancelled_date': cancelled_date}
    )


def send_studio_staff_signup_verification_mail(host_name, staff_email, verification_code, to):
    _send_mail(
        subject="Staff Verification",
        sender=settings.EMAIL_SLICE_REPUBLIC_FROM,
        receiver=to,
        template_name='studio_staff_signup_verification',
        context={'host_name': host_name, 'staff_email': staff_email, 'verification_code': verification_code},
    )


def _send_mail(**kwargs):
    subject, from_email, to = kwargs.get('subject'), kwargs.get('sender'), kwargs.get('receiver')
    html = get_template('emails/%s.html' % kwargs.get('template_name'))
    context = kwargs.get('context')
    email_context = Context(context)
    html_content = html.render(email_context)
    text_content = strip_tags(html_content)

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, 'text/html')
    attachments = kwargs.get('attachments')
    if attachments:
        for attachment in attachments:
            msg.attach(attachment.file_name, attachment.content, attachment.mime_type)
    msg.send()
