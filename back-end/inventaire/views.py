from django.shortcuts import render,get_object_or_404
from rest_framework import viewsets,status
from .models import Product,Warehouse
from .serializer import ProductSerializer,WarehouseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    #TRANSFERT :DEPLACEMENT D'UN PRODUIT VERS UN AUTRE ENTREPOT
    #@action permet d'ajouter une route personnalisée à un ViewSet,
    # en plus du CRUD standard.
    @action(detail=True,methods=['post'])
    def move(self,request,pk=None):
    #recuperer d'abord le produit à déplacer
     produit = self.get_object()
    #verifier si i l'etat périmé
     if produit.etat == Product.Etat.PERIME:
         return Response(status=status.HTTP_400_BAD_REQUEST)
    #sinon recuperer le nouveau entrepot
     else:
      entrepot = request.data.get('entrepot')
    #verifier s'il existe
      nouvel_entrepot = get_object_or_404(Warehouse,pk=entrepot)
    #deplacer et sauvegarder
      produit.entrepot = nouvel_entrepot
      produit.save()
    # serializer et reponse
     serializer = ProductSerializer(produit)
     return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    #AUDIT
    @action(detail=True,methods=['get'])
    def audit(self,request,pk=None):
        #recupere l entrepot concerné
        entrepot = self.get_object()
        #compter le nbre total de produit liés à cet entrepot
        nbre_produit = entrepot.product_set.count()
        #retourner le nbre total
        return Response({'nombre de produits total ': nbre_produit},status=status.HTTP_200_OK)