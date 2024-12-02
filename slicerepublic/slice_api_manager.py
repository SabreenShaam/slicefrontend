import logging
from partnerportal.service_url import construct_staff_login_verification_url, construct_get_class_url, \
    construct_class_cancel_url, construct_mbo_service_url, construct_mbo_service_summary_url, \
    construct_external_studio_access_list_url, construct_update_studio_access_list_url, \
    construct_get_user_list_with_search_parameters, construct_get_booking_list_with_search_parameters, \
    construct_get_studios, construct_passport_studio_access_url, construct_get_prices
from slicerepublic.slice_api_calls import SliceApiCalls

logger = logging.getLogger(__name__)


def check_valid_mbo_staff(email, password, studio_id):
    url = construct_staff_login_verification_url()
    post_params = {'username': email, 'password': password, 'studio_id': studio_id}
    api_call = SliceApiCalls()
    response = api_call.make_post_api_request_without_data(url, post_params)
    return response


def get_all_classes_by_studio(studio_id, date):
    url = construct_get_class_url(studio_id)
    api_call = SliceApiCalls()
    get_params = {'search_date': date}
    response = api_call.make_get_api_request(url, get_params)
    logger.debug("get_all_classes_by_studio() with status code {}".format(response.status_code))
    return response


def cancel_class(class_id):
    url = construct_class_cancel_url(class_id)
    api_call = SliceApiCalls()
    get_params = {'key': 'empty'}
    response = api_call.make_get_api_request(url, get_params)
    logger.debug("cancel_class() with status code {}".format(response.status_code))
    return response


def save_mbo_service(service_id, studio_id, count, max_per_studio_count):
    url = construct_mbo_service_url()
    api_call = SliceApiCalls()
    get_params = {'service_id': service_id, 'studio_id': studio_id, 'count': count,
                  'max_per_studio_count': max_per_studio_count}
    response = api_call.make_post_slice_service_api_call(url, get_params)
    logger.debug("save_mbo_service() with status code {}".format(response.status_code))
    return response


def update_mbo_service_state(service_id, studio_id, state):
    url = construct_mbo_service_url()
    api_call = SliceApiCalls()
    post_params = {'service_id': service_id, 'studio_id': studio_id, 'state': state}
    response = api_call.make_post_slice_service_api_call(url, post_params)
    logger.debug("update_mbo_service_state() with status code {}".format(response.status_code))
    return response


def get_mbo_service(studio_id):
    url = construct_mbo_service_summary_url()
    api_call = SliceApiCalls()
    get_params = {'studio_id': studio_id}
    response = api_call.make_get_api_request(url, get_params)
    logger.debug("get_mbo_service() with status code {}".format(response.status_code))
    return response


def get_available_studio_services(studio_id):
    url = construct_mbo_service_summary_url()
    api_call = SliceApiCalls()
    get_params = {'studio_id': studio_id}
    response = api_call.make_get_api_request(url, get_params)
    logger.debug("get_available_studio_services() with status code {}".format(response.status_code))
    return response


def get_external_studio_access_list(studio_id):
    url = construct_external_studio_access_list_url(studio_id)
    api_call = SliceApiCalls()
    get_params = {'studio_id': studio_id}
    response = api_call.make_get_api_request(url, get_params)
    logger.debug("Retrieved external studio access list with status code {}".format(response.status_code))
    return response


def update_studio_access_list(studio_id, ext_studio_id, has_access):
    url = construct_update_studio_access_list_url(studio_id, ext_studio_id)
    api_call = SliceApiCalls()
    params = {'is_accessible': has_access}
    response = api_call.make_post_api_request_without_data(url, params)
    logger.debug("Updated external studio access list with status code {}".format(response.status_code))
    return response


def get_user_list(q_param=""):
    url = construct_get_user_list_with_search_parameters(q_param)
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_get_api_request(url, params)
    return response


def get_booking_list(q_param=""):
    url = construct_get_booking_list_with_search_parameters(q_param)
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_get_api_request(url, params)
    return response


def get_studio_list():
    url = construct_get_studios()
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_get_api_request(url, params)
    return response


def get_price_list():
    url = construct_get_prices()
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_get_api_request(url, params)
    return response


def get_passport_access_list(service_id, q_param=""):
    url = construct_passport_studio_access_url(service_id, q_param)
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_get_api_request(url, params)
    return response


def update_passport_access_list(passport_studio_access_id, is_accessible):
    url = construct_passport_studio_access_url(passport_studio_access_id, is_accessible)
    api_call = SliceApiCalls()
    params = {'empty': 'empty'}
    response = api_call.make_post_slice_service_api_call(url, params)
    return response


def update_studio_pricing(id, price):
    url = construct_get_prices()
    api_call = SliceApiCalls()
    params = {'id': id, 'price': price}
    response = api_call.make_post_slice_service_api_call(url, params)
    return response
