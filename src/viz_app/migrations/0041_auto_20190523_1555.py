# Generated by Django 2.0.6 on 2019-05-23 19:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0040_sleepdata_regularity'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='siteprivileges',
            options={'managed': False, 'permissions': (('aggregate', 'Can view aggregate data'), ('individual', 'Can view specific individual data'), ('study1', 'Can view GCS study data'), ('study2', 'Can view followup study data'))},
        ),
    ]