# Generated by Django 2.0.6 on 2018-08-19 14:50

import datetime
import json
import os

from django.db import migrations
from django.utils import timezone
from dateutil import tz
from ..value_mappings import *


# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('x'))]


def populate_temp_data(apps, schema_editor):
    print(os.listdir('../../../../../'))
    directory = '../../../../../opt/data/E4/TEMP'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS['Temperature']
    for tempFile in files:
        filenameElements = tempFile.split('_')
        participant = filenameElements[0]
        hand = filenameElements[2]
        frequency = filenameElements[3][:-5]
        data = json.load(open(directory + '/' + tempFile, 'r'))
        for dateString in data["temp"]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString)/1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            temp = data["temp"][dateString]
            if temp is not None and (temp < bounds[0] or temp > bounds[1]):
                temp = None
            frac = data["fraction_of_measurements"][dateString]
            line = PhysData(date=date,
                            category='Temperature',
                            hand=hand,
                            interval=frequency,
                            name=participant,
                            measurement=temp,
                            fraction=frac)
            line.save()



class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0011_auto_20180819_1446'),
    ]

    operations = [
        migrations.RunPython(populate_temp_data)
    ]
