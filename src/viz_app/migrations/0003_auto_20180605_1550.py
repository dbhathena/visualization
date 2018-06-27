# Generated by Django 2.0.6 on 2018-06-05 15:50

import json
import os

from django.db import migrations

# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('x'))]

def populate_hr_data(apps, schema_editor):
    directory = '../data/E4/HR'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for hrFile in files:
        filenameElements = hrFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + hrFile, 'r'))
        for dateString in data:
            hr = data[dateString]
            line = PhysData(date=dateString,
                            category="hr",
                            interval=frequency,
                            name=participant,
                            measurement=hr)
            line.save()

class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0002_auto_20180605_1508'),
    ]

    operations = [
        migrations.RunPython(populate_hr_data)
    ]
