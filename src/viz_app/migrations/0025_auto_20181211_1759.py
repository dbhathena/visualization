# Generated by Django 2.0.6 on 2018-12-11 22:59

from django.db import migrations

def delete_all_phone_data(apps, schema_editor):
    PhysData = apps.get_model('viz_app', 'PhysData')
    PhysData.objects.filter(group='Phone_Usage').delete()
    PhysData.objects.filter(group='Phone Usage').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0024_auto_20181117_1551'),
    ]

    operations = [
        migrations.RunPython(delete_all_phone_data)
    ]
