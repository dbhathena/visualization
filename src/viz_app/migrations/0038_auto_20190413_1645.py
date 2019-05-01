# Generated by Django 2.0.6 on 2019-04-13 20:45

from django.db import migrations


def change_fraction_motion_to_minutes(apps, schema_editor):
    PhysData = apps.get_model('viz_app', 'PhysData')
    for line in PhysData.objects.filter(category='Motion'):
        if line.measurement is not None:
            line.measurement = line.measurement*24*60
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0037_auto_20190413_1503'),
    ]

    operations = [
        migrations.RunPython(change_fraction_motion_to_minutes),
    ]