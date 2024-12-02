from django.http import HttpResponse
from accounts.staff import Staff
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from staff import models
from slicerepublic import dateutil

from slicerepublic.slice_api_manager import get_external_studio_access_list, update_studio_access_list, get_user_list, \
    get_studio_list, get_mbo_service, save_mbo_service, update_mbo_service_state, get_all_classes_by_studio, \
    cancel_class, get_passport_access_list, update_passport_access_list, get_price_list, update_studio_pricing

import json
import logging


class StudioAccessListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        self.login_required()
        staff = Staff(request.user)
        api_studio_id = staff.get_api_studio_id()

        self.logger.info("Staff {} Entered StudioAccessListView".format(staff.get_id()))

        response = get_external_studio_access_list(api_studio_id)

        self.logger.info("Leaving StudioAccessListView")
        return Response(json.loads(response.text), status=status.HTTP_200_OK)

    def login_required(self):
        authenticated = self.request.user.is_authenticated()
        if not authenticated:
            # todo: throw not authenticated exception
            pass


class StudioAccessView(APIView):
    logger = logging.getLogger(__name__)

    def post(self, request, ext_studio_id):
        self.logger.info("Entered StudioAccessView")
        staff = Staff(request.user)
        home_studio_id = staff.get_api_studio_id()

        if request.query_params:
            has_access = request.query_params['has_access']
            print("id : {}, has_access : {}".format(ext_studio_id, has_access))
            response = update_studio_access_list(home_studio_id, ext_studio_id, has_access)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def login_required(self):
        authenticated = self.request.user.is_authenticated()
        if not authenticated:
            # todo: throw not authenticated exception
            pass


class UserListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        self.login_required()

        self.logger.info("Admin with email {} Entered UserListView".format(request.user.email))
        if request.query_params:
            query_string = self.construct_query_string(request)
            response = get_user_list(query_string)
        else:
            response = get_user_list()

        self.logger.info("Leaving UserListView")
        return Response(json.loads(response.text), status=status.HTTP_200_OK)

    def login_required(self):
        authenticated = self.request.user.is_authenticated()
        if not authenticated:
            # todo: throw not authenticated exception
            pass

    def construct_query_string(self, request):
        data = request.query_params
        query_string = ''
        for key in data.keys():
            query_string += str(key) + '=' + str(data[key]) + "&"
        return query_string


class StudioListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        response = get_studio_list()
        return Response(json.loads(response.text), status=status.HTTP_200_OK)


class StudioPriceListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        response = get_price_list()
        return Response(json.loads(response.text), status=status.HTTP_200_OK)

    def post(self, request):
        response_data = {}
        response = update_studio_pricing(request.query_params['id'], request.query_params['price'])
        if response.ok:
            response_data['code'] = 200
            return HttpResponse(json.dumps(response_data), content_type='application/json')

        return HttpResponse(json.dumps(response_data), content_type='application/json')


class ExternalCreditsView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        staff = Staff(request.user)
        api_studio_id = staff.get_api_studio_id()
        try:
            response = get_mbo_service(api_studio_id)
            if response.status_code != 404:
                return Response(json.loads(response.text), status=status.HTTP_200_OK)
        except:
            # todo : improve this
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class UpdateCreditsView(APIView):
    logger = logging.getLogger(__name__)

    def post(self, request):
        response_data = {}
        staff = Staff(request.user)
        api_studio_id = staff.get_api_studio_id()
        try:
            if 'state' not in request.data:
                response = save_mbo_service(request.data['id'], api_studio_id, request.data['count'], request.data['max_per_count'])
                if response.ok:
                    response_data['code'] = 200
                    return HttpResponse(json.dumps(response_data), content_type='application/json')
            else:
                response = update_mbo_service_state(request.data['id'], api_studio_id, request.data['state'])
                if response.ok:
                    response_data['code'] = 200
                    return HttpResponse(json.dumps(response_data), content_type='application/json')
        except :
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_200_OK)


class ClassListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        try:
            if request.query_params:
                date = request.query_params['date']
            else:
                current_datetime = dateutil.get_local_datetime(dateutil.utcnow(), "Europe/London")
                date = str(current_datetime.year) + "-" + str(current_datetime.month) + "-" + str(current_datetime.day)
            staff = models.Staff.objects.get_staff_by_user_id(request.user.id)
            response = get_all_classes_by_studio(staff.studio.api_studio_id, date)
            if response.status_code != 404:
                return Response(json.loads(response.text), status=status.HTTP_200_OK)
        except:
            pass


class ClassCancellationView(APIView):
    logger = logging.getLogger(__name__)

    def post(self, request, pk):
        try:
            result = {}
            response = cancel_class(pk)
            if response.status_code == 200:
                json_data = json.loads(response.text)
                if json_data['code'] == 100010:
                    result = {'code': 100010}
                    return Response(result, status=status.HTTP_200_OK)
                elif json_data['code'] == 100020:
                    result = {'code': 100020, 'message': 'Cannot proceed until the class get cancelled in mind body.'}
                    return Response(result, status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PassportStudioAccessView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request, pk):
        try:
            response = get_passport_access_list(pk)
            if response.status_code != 404:
                return Response(json.loads(response.text), status=status.HTTP_200_OK)
        except:
            # todo : improve this
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, pk):
        response_data = {}
        try:
            is_accessible = self.get_is_accessible()
            response = update_passport_access_list(pk, is_accessible)
            if response.ok:
                response_data['code'] = 200
                return HttpResponse(json.dumps(response_data), content_type='application/json')
        except:
            # todo : improve this
            pass

    def login_required(self):
        authenticated = self.request.user.is_authenticated()
        if not authenticated:
            # todo: throw not authenticated exception
            pass

    def get_is_accessible(self):
        return self.request.query_params.get('is_accessible')
