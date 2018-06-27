# Generated by Django 2.0.6 on 2018-06-05 00:52

import json
import os

from django.db import migrations

# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('x'))]

def populate_acc_data(apps, schema_editor):
    directory = '../data/E4/ACC'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for accFile in files:
        filenameElements = accFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + accFile, 'r'))
        for dateString in data["empatica_motion_vector"]:
            acc = data["empatica_motion_vector"][dateString]
            frac = data["fraction_of_measurements"][dateString]
            line = PhysData(date=dateString,
                            category="acc",
                            interval=frequency,
                            name=participant,
                            measurement=acc,
                            fraction=frac)
            line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0003_auto_20180605_1550'),
    ]

    operations = [
        migrations.RunPython(populate_acc_data)
    ]
