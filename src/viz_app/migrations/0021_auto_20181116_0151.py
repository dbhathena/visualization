# Generated by Django 2.0.6 on 2018-11-16 06:51

from django.db import migrations


def change_null_to_zero_durations(apps, schema_editor):
    PhysData = apps.get_model("viz_app", "PhysData")
    for line in PhysData.objects.filter(category__contains='Duration'):
        if line.measurement == None:
            line.measurement = 0
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0020_auto_20181108_2216'),
    ]

    operations = [
        migrations.RunPython(change_null_to_zero_durations)
    ]
