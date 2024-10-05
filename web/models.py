from django.db import models
from django.contrib.auth.models  import User
from django.utils.text import slugify

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
    
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Media(models.Model):
    url = models.URLField(default="pexels-luis-gomes-546819.jpg")
    description = models.TextField(default="mine is ")

    def __str__(self):
        return self.description 


class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True,max_length=255, blank=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mainMedia = models.ManyToManyField(Media)

    def save(self, *args, **kwargs):
        if not self.slug:  # Only create slug if it is not set
            base_slug = slugify(self.title)  # Create a slug from the title
            slug = base_slug
            num = 1
            while Article.objects.filter(slug=slug).exists():  # Ensure the slug is unique
                slug = f'{base_slug}-{num}'
                num += 1
            self.slug = slug
        super().save(*args, **kwargs) 

    def __str__(self):
        return self.title
    
   

