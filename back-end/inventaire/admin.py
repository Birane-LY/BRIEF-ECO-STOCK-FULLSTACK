from django.contrib import admin
from .models import Product,Warehouse

# Register your models here.
admin.site.register(Warehouse)
admin.site.register(Product)