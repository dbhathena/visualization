# Generated by Django 2.0.6 on 2019-01-03 17:26

import datetime
import json
import os

from django.db import migrations, models
from django.utils import timezone
from dateutil import tz

DATE_FORMAT = '%Y-%m-%d %H'

# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('.'))]


def populate_weather_data(apps, schema_editor):
    directory = '../../../../../opt/data/Weather'
    # directory = '../../data/Weather'
    files = get_files(directory)
    WeatherData = apps.get_model('viz_app', 'WeatherData')
    for weatherFile in files:
        filenameElements = weatherFile.split('_')
        participant = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + weatherFile, 'r'))
        for day_data in data:
            date_string = day_data["date"] + " 00"
            date = datetime.datetime.strptime(date_string, DATE_FORMAT)
            insolation = day_data["insolationSeconds"]
            precipitation = day_data["precipIntensity"]
            temp_high = day_data["apparentTemperatureHigh"]
            insolation_line = WeatherData(name=participant,
                                          date=date,
                                          category="Insolation Seconds",
                                          measurement=insolation,
                                          group="Weather")
            precipitation_line = WeatherData(name=participant,
                                             date=date,
                                             category="Precipitation Intensity",
                                             measurement=precipitation,
                                             group="Weather")
            temp_high_line = WeatherData(name=participant,
                                         date=date,
                                         category="Apparent Temperature High",
                                         measurement=temp_high,
                                         group="Weather")
            insolation_line.save()
            precipitation_line.save()
            temp_high_line.save()

class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0027_auto_20181211_1832'),
    ]

    operations = [
        migrations.CreateModel(
            name='WeatherData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=4, null=True)),
                ('date', models.DateTimeField(null=True)),
                ('category', models.CharField(max_length=200, null=True)),
                ('measurement', models.FloatField(null=True)),
                ('group', models.CharField(max_length=200, null=True)),
            ],
        ),
        migrations.RunPython(populate_weather_data)
    ]
