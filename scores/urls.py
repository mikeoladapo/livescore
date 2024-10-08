from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('web.routes')),
    path('m/', include('mobile.routes')),
    #path('web/', include('pc.routes')),
]
