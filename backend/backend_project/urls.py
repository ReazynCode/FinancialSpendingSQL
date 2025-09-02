"""
URL configuration for backend_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  
from api.views import get_data #You import the views function from the api.
F

#Path function definition: It creates a single, specific rule for routing a URL to a view via django 
#Arguments; 1: the specific url address it is looking for. 2: The python code that will run when it finds that specific url address 

urlpatterns = [
    path('admin/', admin.site.urls),
    #Check if api is in the link. If it is redirect/passes the rest of the link to api/urls.py. Makes the code more organized
    path('api/', include('api.urls'))
    path('api/data/', get_data)
]

#tmrw add more in the path
 
