from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


# Create your views here.
# allow only GET method
@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List': '/tasks/',
        'Detail': '/task/<int:pk>/',
        'Create': '/task/create/',
        'Update': '/task/<int:pk>/update/',
        'Delete': '/task/<int:pk>/delete/'
    }
    return Response(api_urls)


@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def task_detail(request, pk):
    task = get_object_or_404(Task, id=pk)
    serializer = TaskSerializer(task)
    return Response(serializer.data)


@api_view(['POST'])
def task_create(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def task_update(request, pk):
    task = get_object_or_404(Task, id=pk)
    serializer = TaskSerializer(data=request.data, instance=task)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def task_delete(request, pk):
    task = get_object_or_404(Task, id=pk)
    task.delete()

    return Response("Task deleted.")
