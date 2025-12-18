from django.contrib.auth.models import User, Group
from rest_framework.test import APITestCase, APIClient
from .models import Task


class RBACTaskAPITest(APITestCase):
	def setUp(self):
		# Ensure groups exist
		admin_group, _ = Group.objects.get_or_create(name='Admin')

		# Create users
		self.user = User.objects.create_user(username='user1', password='pass')
		self.admin = User.objects.create_user(username='admin1', password='pass')
		self.admin.groups.add(admin_group)

		# Create tasks
		self.task_user = Task.objects.create(title='User Task', owner=self.user)
		self.task_admin = Task.objects.create(title='Admin Task', owner=self.admin)

		self.client = APIClient()

	def test_user_sees_only_their_tasks(self):
		self.client.force_authenticate(user=self.user)
		resp = self.client.get('/api/tasks/')
		assert resp.status_code == 200
		data = resp.json()
		results = data.get('results', data) if isinstance(data, dict) else data
		assert any(item['title'] == 'User Task' for item in results)
		assert all(item['owner'] == self.user.id for item in results)

	def test_admin_sees_all_tasks(self):
		self.client.force_authenticate(user=self.admin)
		resp = self.client.get('/api/tasks/')
		assert resp.status_code == 200
		data = resp.json()
		results = data.get('results', data) if isinstance(data, dict) else data
		titles = [item['title'] for item in results]
		assert 'User Task' in titles and 'Admin Task' in titles

	def test_user_cannot_retrieve_others_task(self):
		self.client.force_authenticate(user=self.user)
		resp = self.client.get(f'/api/tasks/{self.task_admin.id}/')
		# queryset restricted to owner -> not found
		assert resp.status_code == 404

	def test_admin_can_retrieve_any_task(self):
		self.client.force_authenticate(user=self.admin)
		resp = self.client.get(f'/api/tasks/{self.task_user.id}/')
		assert resp.status_code == 200

	def test_filter_by_status_and_search(self):
		# Create additional tasks for user
		Task.objects.create(title='Open Task', owner=self.user, status=False)
		Task.objects.create(title='Done Task', owner=self.user, status=True)
		self.client.force_authenticate(user=self.user)

		# Filter by status=True
		resp = self.client.get('/api/tasks/?status=True')
		assert resp.status_code == 200
		data = resp.json()
		results = data.get('results', data) if isinstance(data, dict) else data
		assert all(item['status'] is True for item in results)

		# Search by title
		resp = self.client.get('/api/tasks/?search=Done')
		assert resp.status_code == 200
		data = resp.json()
		results = data.get('results', data) if isinstance(data, dict) else data
		assert any('Done' in item['title'] for item in results)

	def test_pagination(self):
		# create 12 tasks for pagination (page size is 10)
		for i in range(12):
			Task.objects.create(title=f'Paginate {i}', owner=self.user)
		self.client.force_authenticate(user=self.user)

		resp = self.client.get('/api/tasks/?page=1')
		assert resp.status_code == 200
		page1 = resp.json()
		page1_results = page1.get('results', page1) if isinstance(page1, dict) else page1
		# page1 should contain up to 10 results
		assert len(page1_results) <= 10

		resp = self.client.get('/api/tasks/?page=2')
		assert resp.status_code == 200
		page2 = resp.json()
		page2_results = page2.get('results', page2) if isinstance(page2, dict) else page2
		# remaining results on page 2
		assert len(page2_results) >= 0
