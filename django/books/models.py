from django.db import models


# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    author = models.CharField(max_length=300)
    publisher = models.CharField(max_length=300, null=True, blank=True)
    image = models.URLField(max_length=300, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    publishedAt = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

class Collection(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    books = models.ManyToManyField(Book)

    def __str__(self):
        return self.title


