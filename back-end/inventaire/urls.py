from rest_framework import routers
from .views import ProductViewSet,WarehouseViewSet
router = routers.DefaultRouter()
router.register('produits',ProductViewSet,basename='produit')
router.register('warehouses',WarehouseViewSet,basename='warehouse')
urlpatterns = router.urls

