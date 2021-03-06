# Generated by Django 2.0.6 on 2020-07-07 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0052_study2'),
    ]

    operations = [
        migrations.CreateModel(
            name='DepData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=4, null=True)),
                ('date', models.DateTimeField(null=True)),
                ('category', models.CharField(max_length=200, null=True)),
                ('interval', models.CharField(max_length=10, null=True)),
                ('measurement', models.FloatField(null=True)),
                ('group', models.CharField(max_length=200, null=True)),
            ],
        ),
    ]
