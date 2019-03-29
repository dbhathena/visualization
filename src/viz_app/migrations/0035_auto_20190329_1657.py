# Generated by Django 2.0.6 on 2019-03-29 20:57

from django.db import migrations


def change_missing_to_MDD(apps, schema_editor):
    DemographicData = apps.get_model('viz_app', 'DemographicData')
    for line in DemographicData.objects.filter(study_group='missing'):
        line.study_group = 'MDD'
        line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0034_demographicdata'),
    ]

    operations = [
        migrations.RunPython(change_missing_to_MDD)
    ]