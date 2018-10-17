# Generated by Django 2.0.6 on 2018-08-19 16:07

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


def populate_motion_data(apps, schema_editor):
    directory = '../../../../../opt/data/E4/TEMP'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Motion"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[4][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        for dateString in data["fraction_of_time_in_motion"]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            motionFrac = data["fraction_of_time_in_motion"][dateString]
            if motionFrac is not None and (motionFrac < bounds[0] or motionFrac > bounds[1]):
                motionFrac = None
            timeFrac = data["fraction_of_measurements"][dateString]
            line = PhysData(date=date,
                            category="Motion",
                            name=participant,
                            interval=frequency,
                            measurement=motionFrac,
                            fraction=timeFrac)
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0014_auto_20180819_1556'),
    ]

    operations = [
        migrations.RunPython(populate_motion_data)
    ]
