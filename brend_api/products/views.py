from django.shortcuts import render
from django.http import HttpResponse
from .models import Product

# Рендеринг страницы при открытии браузера
def index(request):
    if request.method == "GET":
        all_products = Product.objects.order_by("-price").all()
        context = {"all_products": all_products, "table_titles": ["Название", "Описание", "Цена"]}
        return render(request, "products/index.html",  context)
