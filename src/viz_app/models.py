from django.db import models

# Create your models here.

class PhysData(models.Model):
    name = models.CharField(null=True, max_length=4)
    date = models.DateTimeField(null=True)
    category = models.CharField(null=True, max_length=200)
    hand = models.CharField(null=True, max_length=5)
    interval = models.CharField(null=True, max_length=10)
    measurement = models.FloatField(null=True)
    fraction = models.FloatField(null=True)

    def __str__(self):
        return "Date: " + str(self.date) + " Measurement: " + str(self.measurement)
