from django.db import models
from django.contrib.auth.models  import User

class Country(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=80, blank=True, null=True)
    flag = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    name = models.CharField(max_length=255)
    league_id = models.IntegerField(unique=True, blank=True)
    type = models.CharField(max_length=50, blank=True)
    logo = models.URLField(blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User ,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title    

