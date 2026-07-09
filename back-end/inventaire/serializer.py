from rest_framework import serializers
from .models import Product,Warehouse
class ProductSerializer(serializers.ModelSerializer):
    class Meta():
        model = Product
        fields = ['id','nom','quantitee','date_expiration','etat','entrepot']


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta():
        model = Warehouse
        fields = ['id','nom','localisation','capacitee']
    