from django.contrib import admin
from .models import Country, Tournament , Article,Media,Category

admin.site.register(Country)
admin.site.register(Tournament)
admin.site.register(Article)
admin.site.register(Media)
admin.site.register(Category)
