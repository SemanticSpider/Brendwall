from django.db import models

# Модель продуктов
class Product(models.Model):
    title = models.CharField(max_length=400)
    descr = models.TextField(blank=True, null=True)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.title
