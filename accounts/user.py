# from accounts import models
#
#
# class User(object):
# 	def __init__(self, id, password):
# 		self.id = id
# 		self.password = password
#
# 	def get_user(self):
# 		try:
# 			user = models.User.objects.get(id=self.id)
# 		except models.User.DoesNotExist:
# 			raise Exception("User not exist")
# 		return user
#
# 	def update(self):
# 		user = self.get_user()
# 		user.set_password(self.password)
# 		user.save()
