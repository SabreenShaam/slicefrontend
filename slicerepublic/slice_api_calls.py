import requests
import json


def make_get_slice_service_api_call(url, get_params):
    headers = {'content-type': 'application/json'}
    response = requests.get(url, data=json.dumps(get_params), headers=headers, verify=False)
    return response


def make_post_slice_service_api_call(url, data):
    headers = {'content-type': 'application/json'}
    response = requests.post(url=url, data=json.dumps(data), headers=headers, verify=False)
    return response


def make_post_slice_service_api_call_without_data(url, params):
    headers = {'content-type': 'application/json'}
    response = requests.post(url=url, params=params, headers=headers, verify=False)
    return response


class SliceApiCalls:
    def make_get_api_request(self, url, params):
        try:
            response = make_get_slice_service_api_call(url, params)
        except:
            raise ConnectionError("Server Error: Failed to establish a connection")
        return response

    def make_post_slice_service_api_call(self, url, data):
        try:
            response = make_post_slice_service_api_call(url, data)
        except:
            raise ConnectionError("Server Error: Failed to establish a connection")
        return response

    def make_post_api_request_without_data(self, url, params):
        try:
            response = make_post_slice_service_api_call_without_data(url, params)
        except:
            raise ConnectionError("Server Error: Failed to establish a connection")
        return response
