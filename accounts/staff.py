import logging
from staff import models


class Staff(object):
    logger = logging.getLogger(__name__)

    def __init__(self, user):
        self.user = user
        if not user:
            raise Exception("User does not exist with the given username password combination")

        staff = models.Staff.objects.get_staff_by_user_id(user.id)
        if not staff:
            self.logger.error("Staff is not in system")
            raise Exception("Staff is not in system")

        self.staff = staff

    def validate(self):
        studio = self.get_studio()
        if not studio:
            self.logger.error("Studio not exist")
            raise Exception("Studio not exist")
        if not studio.is_active:
            raise Exception("Couldn't login, the studio you are trying to login is not active")
        return True

    def get_studio(self):
        return self.staff.studio

    def get_api_studio_id(self):
        studio = self.get_studio()
        return studio.api_studio_id

    def get_id(self):
        return self.staff.id

