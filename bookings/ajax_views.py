import logging
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from slicerepublic.slice_api_manager import get_booking_list
from staff.models import Staff


class BookingListView(APIView):
    logger = logging.getLogger(__name__)

    def get(self, request):
        self.login_required()
        staff = Staff(request.user)

        self.logger.info("Staff {} Entered UserListView".format(staff.id))
        if request.query_params:
            query_string = self.construct_query_string(request)
            response = get_booking_list(query_string)
        else:
            response = get_booking_list()

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
            if query_string == '':
                query_string += str(key) + '=' + str(data[key])
            else:
                query_string += "&" + str(key) + '=' + str(data[key])

        return query_string
