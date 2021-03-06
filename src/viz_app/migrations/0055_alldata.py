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


def populate_motion_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_MOTION'
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

def reverse_populate_motion_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_MOTION'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[4][:-5]
        PhysData.objects.filter(name=participant, category="Motion", interval=frequency).delete()

def populate_acc_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_ACC'
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

def reverse_populate_acc_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_ACC'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[2][:-5]
        PhysData.objects.filter(name=participant, category="Accelerometer", interval=frequency).delete()

def populate_sleep_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_SLEEP'
    files = get_files(directory)
    SleepData = apps.get_model('viz_app', 'SleepData')
    for sleepFile in files:
        filenameElements = sleepFile.split('_')
        participant = filenameElements[0]
        data = json.load(open(directory + '/' + sleepFile, 'r'))['sleep_category']
        for dateString in data:
            naive_date = datetime.datetime.fromtimestamp(int(dateString)/1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            sleep_integer = data[dateString]
            is_asleep = None if sleep_integer == -1 else bool(sleep_integer)
            line = SleepData(name=participant,
                             date=date,
                             category="Recorded Sleep",
                             is_asleep=is_asleep)
            line.save()

def reverse_populate_sleep_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_SLEEP'
    files = get_files(directory)
    SleepData = apps.get_model('viz_app', 'SleepData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        SleepData.objects.filter(name=participant, category="Recorded Sleep").delete()


def populate_dep_data_daily(apps, schema_editor):
    directory = 'data/E4/STUDY2_DEPDAILY'
    files = get_files(directory)
    DepData = apps.get_model('viz_app', 'DepData')
    bounds = MEASUREMENT_THRESHOLDS["Daily (PHQ-9)"]
    for depFile in files:
        filenameElements = depFile.split('_')
        participant = filenameElements[0]
        frequency = "daily"
        data = json.load(open(directory + '/' + depFile, 'r'))
        for dateString in data["depression_scales_daily"]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            depScale = data["depression_scales_daily"][dateString]
            line = DepData(date=date,
                            category="Daily (PHQ-9)",
                            name=participant,
                            interval=frequency,
                            measurement=depScale)
            line.save()


def reverse_populate_daily_dep_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_DEPDAILY'
    files = get_files(directory)
    DepData = apps.get_model('viz_app', 'DepData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[3][:-5]
        DepData.objects.filter(name=participant, category="Daily (PHQ-9)", interval=frequency).delete()


def populate_dep_data_weekly(apps, schema_editor):
    directory = 'data/E4/STUDY2_DEPWEEKLY'
    files = get_files(directory)
    DepData = apps.get_model('viz_app', 'DepData')
    bounds = MEASUREMENT_THRESHOLDS["Weekly (HDRS)"]
    for depFile in files:
        filenameElements = depFile.split('_')
        participant = filenameElements[0]
        frequency = "weekly"
        data = json.load(open(directory + '/' + depFile, 'r'))
        for dateString in data["depression_scales_weekly"]:
            naive_date = datetime.datetime.fromtimestamp(int(dateString) / 1000)
            date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))
            depFrac = data["depression_scales_weekly"][dateString]
            line = DepData(date=date,
                            category="Weekly (HDRS)",
                            name=participant,
                            interval=frequency,
                            measurement=depFrac)
            line.save()

def reverse_populate_weekly_dep_data(apps, schema_editor):
    directory = 'data/E4/STUDY2_DEPWEEKLY'
    files = get_files(directory)
    DepData = apps.get_model('viz_app', 'DepData')
    for f in files:
        filenameElements = f.split('_')
        participant = filenameElements[0]
        frequency = filenameElements[3][:-5]
        DepData.objects.filter(name=participant, category="Weekly (HDRS)", interval=frequency).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0054_depdata'),
    ]

    operations = [
        migrations.RunPython(populate_dep_data_daily, reverse_populate_daily_dep_data),
        migrations.RunPython(populate_dep_data_weekly, reverse_populate_weekly_dep_data),
        migrations.RunPython(populate_motion_data, reverse_populate_motion_data),
        migrations.RunPython(populate_acc_data, reverse_populate_acc_data),
        migrations.RunPython(populate_sleep_data, reverse_populate_sleep_data),
    ]
