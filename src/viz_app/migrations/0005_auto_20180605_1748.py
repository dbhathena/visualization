# Generated by Django 2.0.6 on 2018-06-05 17:48

import json
import os

from django.db import migrations


# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('.'))]


def populate_motion_data(apps, schema_editor):
    directory = '../../data/E4/MOTION'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[4][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        for dateString in data["fraction_of_time_in_motion"]:
            motionFrac = data["fraction_of_time_in_motion"][dateString]
            timeFrac = data["fraction_of_measurements"][dateString]
            line = PhysData(date=dateString,
                            category="motion",
                            name=participant,
                            interval=frequency,
                            measurement=motionFrac,
                            fraction=timeFrac)
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0004_auto_20180605_1744'),
    ]

    operations = [
        migrations.RunPython(populate_motion_data)
    ]
