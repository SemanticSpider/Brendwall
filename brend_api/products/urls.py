from django.urls import path
from . import views
from . import api

app_name = "products"
urlpatterns = [
    path("", views.index, name="index"),
    path("add-product/", api.add_product, name="add_product") # Обработка запросов из формы
]