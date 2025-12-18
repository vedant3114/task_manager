from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from tasks.models import Task


class TokenAuthTests(APITestCase):
	def setUp(self):
		self.client = APIClient()

	def test_register_login_refresh_and_protected_access(self):
		# Register
		resp = self.client.post('/api/auth/register/', {'username': 'alice', 'password': 's3cret'})
		assert resp.status_code in (200, 201)

		# Login -> obtain tokens
		resp = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 's3cret'})
		assert resp.status_code == 200
		data = resp.json()
		assert 'access' in data and 'refresh' in data
		access = data['access']
		refresh = data['refresh']

		# Refresh -> get new access token
		resp = self.client.post('/api/auth/refresh/', {'refresh': refresh})
		assert resp.status_code == 200
		assert 'access' in resp.json()

		# Create a task for the user directly and access protected endpoint
		user = User.objects.get(username='alice')
		Task.objects.create(title='Alice Task', owner=user)

		# Access protected tasks endpoint with Bearer token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
		resp = self.client.get('/api/tasks/')
		assert resp.status_code == 200
		json_data = resp.json()
		results = json_data.get('results', json_data) if isinstance(json_data, dict) else json_data
		assert any(item['title'] == 'Alice Task' for item in results)
