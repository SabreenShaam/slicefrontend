from partnerportal import settings

BASE_SERVICE_URL = settings.BASE_SERVICE_URL


def construct_staff_login_verification_url():
    login_verification_url = BASE_SERVICE_URL + "api/staffs/staff/auth"
    return login_verification_url


def construct_get_class_url(studio_id):
    get_all_classes_url = BASE_SERVICE_URL + "classes/api/class/" + str(studio_id) + "/studio/"
    return get_all_classes_url


def construct_class_cancel_url(class_id):
    cancel_class_url = BASE_SERVICE_URL + "classes/api/class/" + str(class_id) + "/cancel"
    return cancel_class_url


def construct_mbo_service_url():
    mbo_service_url = BASE_SERVICE_URL + "api/services/service/update"
    return mbo_service_url


def construct_mbo_service_summary_url():
    mbo_service_url = BASE_SERVICE_URL + "api/services/service/summary"
    return mbo_service_url


def construct_studio_service_list_url():
    studio_service_list_url = BASE_SERVICE_URL + "api/services/studio/service/portal"
    return studio_service_list_url


def construct_external_studio_access_list_url(studio_id):
    url = BASE_SERVICE_URL + "venues/api/studio/" + str(studio_id) + "/access-list"
    return url


def construct_update_studio_access_list_url(studio_id, ext_studio_id):
    url = BASE_SERVICE_URL + "venues/api/studio/" + str(studio_id) + "/access/" + str(ext_studio_id)
    return url


def construct_get_user_list_with_search_parameters(query_parameters):
    url = BASE_SERVICE_URL + "accounts/api/users?" + query_parameters
    return url


def construct_get_booking_list_with_search_parameters(query_parameters):
    url = BASE_SERVICE_URL + "api/bookings/?" + query_parameters
    return url


def construct_get_studios():
    url = BASE_SERVICE_URL + "venues/api/studio/"
    return url


def construct_get_prices():
    url = BASE_SERVICE_URL + "venues/api/studio/price"
    return url


def construct_passport_studio_access_url(passport_studio_access_id, is_accessible):
    url = BASE_SERVICE_URL + "api/services/service/" + str(
        passport_studio_access_id) + "/studio-access?is_accessible=" + is_accessible
    return url

