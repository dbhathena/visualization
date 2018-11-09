# Generated by Django 2.0.6 on 2018-11-09 03:16

from django.db import migrations


def change_null_to_zero(apps, schema_editor):
    PhysData = apps.get_model("viz_app", "PhysData")
    for line in PhysData.objects.filter(category__contains='Call Count'):
        if line.measurement == None:
            line.measurement = 0;
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0019_auto_20181019_0226'),
    ]

    operations = [
        migrations.RunPython(change_null_to_zero)
    ]
