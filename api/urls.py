from django.urls import path

from .views import api_overview, task_list, task_detail, task_create, task_update, task_delete

urlpatterns = [
    path('', api_overview, name='api_overview'),
    path('tasks/', task_list, name='task_list'),
    path('task/<int:pk>/', task_detail, name='task_detail'),
    path('task/create/', task_create, name='task_create'),
    path('task/<int:pk>/update/', task_update, name='task_update'),
    path('task/<int:pk>/delete/', task_delete, name='task_delete'),
]
