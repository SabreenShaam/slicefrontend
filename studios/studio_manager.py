from slicerepublic.slice_api_manager import get_available_studio_services
import json


def populate_studio_services(staff):
	response = get_available_studio_services(staff.studio.id)
	response_items = json.loads(response.text)

	return response_items


def pre_populate_external_credit_items(pre_populate_items):

	for pre_populate_item in pre_populate_items:
		pre_populate_item['field_name'] = 'qty_field_' + str(pre_populate_item['id'])
		pre_populate_item['max_per_studio_field'] = 'max_per_studio_field_' + str(pre_populate_item['id'])

