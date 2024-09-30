from django.http import JsonResponse
import json

from .models import Product

# Обработка AJAX
def add_product(request):
    # Получение списка товаров
    if request.method == "GET":
        all_products = Product.objects.order_by("-price").all()
        context = {"all_products": list(all_products.values())}
        return JsonResponse({"data": context})
    
    # Добавление товара
    if request.method == "POST":
        body = json.loads(request.body.decode('utf-8'))

        title, descr, price = body["title"], body["descr"], body["price"]
        added_product = Product.objects.create(
            title=title,
            descr=descr,
            price=price
        )
        if added_product:
            return JsonResponse({"added_product": title})
