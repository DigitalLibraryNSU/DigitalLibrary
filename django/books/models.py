import uuid

from django.db import models


# Create your models here.
class Book(models.Model):
    name = models.CharField(max_length=300)
    documentId = models.UUIDField(default=uuid.uuid4, editable=False)
    description = models.TextField(blank=True)
    author = models.CharField(max_length=300)
    publisher = models.CharField(max_length=300, null=True, blank=True)
    image = models.URLField(max_length=300, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    publishedAt = models.DateTimeField (null=True, blank=True)

