from django.contrib import admin
from .models import Country, Tournament , Article

admin.site.register(Country)
admin.site.register(Tournament)
admin.site.register(Article)