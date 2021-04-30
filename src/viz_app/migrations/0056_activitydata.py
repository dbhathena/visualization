# Generated by Django 2.0.6 on 2019-02-21 00:45

import datetime
import json
import os

from django.db import migrations, models
from django.utils import timezone
from dateutil import tz
from ..value_mappings import *


# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('.'))]


def populate_light_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_LIGHT_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Minutes In Activity Level"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        if "light_hours_24hrs" in data.keys():
            header = "light_hours_24hrs"
        else:
            header = "light_minutes_1hr"
        for dateString in data[header]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            minCount = data[header][dateString]
            if minCount is not None and (minCount < bounds[0] or minCount > bounds[1]):
                minCount = None
            if ("fraction_of_measurements" in data.keys()):
                timeFrac = data["fraction_of_measurements"][dateString]
            else:
                timeFrac = None
            line = PhysData(date=date,
                            category="Light Activity",
                            name=participant,
                            interval=frequency,
                            measurement=minCount,
                            fraction=timeFrac)
            line.save()

def reverse_populate_light_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_LIGHT_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        PhysData.objects.filter(name=participant, category="Light Activity", interval=frequency).delete()

def populate_moderate_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_MODERATE_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Minutes In Activity Level"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        if "moderate_hours_24hrs" in data.keys():
            header = "moderate_hours_24hrs"
        else:
            header = "moderate_minutes_1hr"
        for dateString in data[header]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            minCount = data[header][dateString]
            if minCount is not None and (minCount < bounds[0] or minCount > bounds[1]):
                minCount = None
            if ("fraction_of_measurements" in data.keys()):
                timeFrac = data["fraction_of_measurements"][dateString]
            else:
                timeFrac = None
            line = PhysData(date=date,
                            category="Moderate Activity",
                            name=participant,
                            interval=frequency,
                            measurement=minCount,
                            fraction=timeFrac)
            line.save()

def reverse_populate_moderate_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_MODERATE_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        PhysData.objects.filter(name=participant, category="Moderate Activity", interval=frequency).delete()

def populate_sedentary_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_SEDENTARY_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Minutes In Activity Level"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        if "sedentary_hours_24hrs" in data.keys():
            header = "sedentary_hours_24hrs"
        else:
            header = "sedentary_minutes_1hr"
        for dateString in data[header]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            minCount = data[header][dateString]
            if minCount is not None and (minCount < bounds[0] or minCount > bounds[1]):
                minCount = None
            if ("fraction_of_measurements" in data.keys()):
                timeFrac = data["fraction_of_measurements"][dateString]
            else:
                timeFrac = None
            line = PhysData(date=date,
                            category="Sedentary Activity",
                            name=participant,
                            interval=frequency,
                            measurement=minCount,
                            fraction=timeFrac)
            line.save()

def reverse_populate_sedentary_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_SEDENTARY_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        PhysData.objects.filter(name=participant, category="Sedentary Activity", interval=frequency).delete()

def populate_vigorous_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_VIGOROUS_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Minutes In Activity Level"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        if "vigorous_minutes_1hr" in data.keys():
            header = "vigorous_minutes_1hr"
        else:
            header = "vigorous_hours_24hrs"
        for dateString in data[header]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            minCount = data[header][dateString]
            if minCount is not None and (minCount < bounds[0] or minCount > bounds[1]):
                minCount = None
            if ("fraction_of_measurements" in data.keys()):
                timeFrac = data["fraction_of_measurements"][dateString]
            else:
                timeFrac = None
            line = PhysData(date=date,
                            category="Vigorous Activity",
                            name=participant,
                            interval=frequency,
                            measurement=minCount,
                            fraction=timeFrac)
            line.save()

def reverse_populate_vigorous_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_VIGOROUS_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[5][:-5]
        PhysData.objects.filter(name=participant, category="Vigorous Activity", interval=frequency).delete()

def populate_activity_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    bounds = MEASUREMENT_THRESHOLDS["Minutes In Activity Level"]
    for motionFile in files:
        filenameElements = motionFile.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + motionFile, 'r'))
        if "average_enmo_1min" in data.keys():
            header = "average_enmo_1min"
        else:
            header = "average_enmo_1hr"
        for dateString in data[header]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            minCount = data[header][dateString]
            if minCount is not None and (minCount < bounds[0] or minCount > bounds[1]):
                minCount = None
            if ("fraction_of_measurements" in data.keys()):
                timeFrac = data["fraction_of_measurements"][dateString]
            else:
                timeFrac = None
            line = PhysData(date=date,
                            category="Activity Level",
                            name=participant,
                            interval=frequency,
                            measurement=minCount,
                            fraction=timeFrac)
            line.save()

def reverse_populate_activity_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_ACTIVITY'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        PhysData.objects.filter(name=participant, category="Activity Level", interval=frequency).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0055_alldata'),
    ]

    operations = [
        migrations.RunPython(populate_light_data, reverse_populate_light_data),
        migrations.RunPython(populate_moderate_data, reverse_populate_moderate_data),
        migrations.RunPython(populate_sedentary_data, reverse_populate_sedentary_data),
        migrations.RunPython(populate_vigorous_data, reverse_populate_vigorous_data),
        migrations.RunPython(populate_activity_data, reverse_populate_activity_data),
    ]
