from django.shortcuts import render
from django.http import JsonResponse #This is used to send json responses back to the frontend 

# Create your views here.

def get_data(request):
    if request.method == "GET":
        return JsonResponse({"message": "Aye its backend hello!"})
    else: 
        return JsonResponse({"Error":"invalid request method"}, status = 405) #405 means bad request method 





