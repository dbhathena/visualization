# Generated by Django 2.0.6 on 2018-08-19 15:56

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


def populate_acc_data(apps, schema_editor):
    directory = '../../../../../opt/data/E4/ACC'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS['Accelerometer']
    for accFile in files:
        filenameElements = accFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + accFile, 'r'))
        for dateString in data["empatica_motion_vector"]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            acc = data["empatica_motion_vector"][dateString]
            if acc is not None and (acc < bounds[0] or acc > bounds[1]):
                acc = None
            frac = data["fraction_of_measurements"][dateString]
            line = PhysData(date=date,
                            category="Accelerometer",
                            interval=frequency,
                            name=participant,
                            measurement=acc,
                            fraction=frac)
            line.save()

class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0013_auto_20180819_1536'),
    ]

    operations = [
        migrations.RunPython(populate_acc_data)
    ]
