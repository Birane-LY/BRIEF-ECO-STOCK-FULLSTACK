from django.db import models


class Warehouse(models.Model):
    nom = models.CharField(max_length=255)
    localisation = models.CharField(max_length=255)
    capacitee = models.IntegerField()
     
    def __str__(self):
        return self.nom
    
class Product(models.Model):
    class Etat(models.TextChoices):
        DISPONIBLE = 'disponible','Disponible'
        RESERVE = 'reserve','Réservé'
        PERIME = 'perime','Perimé'
        
    nom = models.CharField(max_length=255)
    quantitee = models.IntegerField()
    date_expiration = models.DateTimeField(auto_now_add=True)
    etat = models.CharField(max_length=20,choices=Etat.choices,default=Etat.DISPONIBLE)
    entrepot = models.ForeignKey(Warehouse,on_delete=models.CASCADE)
    def __str__(self):
        return self.nom