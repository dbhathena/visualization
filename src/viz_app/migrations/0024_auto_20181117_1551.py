# Generated by Django 2.0.6 on 2018-11-17 20:51

import datetime
import json
import os

from django.db import migrations
from django.utils import timezone
from dateutil import tz

DATE_FORMAT = '%Y-%m-%d %H'
MEASUREMENT_TYPE_SUFFIXES = {
    '_Incoming_count_sms': "Incoming SMS Count",
    '_Incoming_mean_sms_length': "Incoming SMS Mean Length",
    '_Incoming_median_sms_length': "Incoming SMS Median Length",
    '_Incoming_std_sms_length': "Incoming SMS Std Length",
    '_Incoming_sum_sms_length': "Incoming SMS Sum Length",
    '_Outgoing_count_sms': "Outgoing SMS Count",
    '_Outgoing_mean_sms_length': "Outgoing SMS Mean Length",
    '_Outgoing_median_sms_length': "Outgoing SMS Median Length",
    '_Outgoing_std_sms_length': "Outgoing SMS Std Length",
    '_Outgoing_sum_sms_length': "Outgoing SMS Sum Length"
}


# Returns a list of the files, ignoring '.files', in the given directory
# Directory is a string of the path to the directory
def get_files(directory):
    files = os.listdir(directory)
    return [x for x in files if not (x.startswith('.'))]


def populate_sms_data(apps, schema_editor):
    # directory = '../../../../../opt/data/Phone/phone_usage/sms'
    directory = '../../data/Phone/phone_usage/sms'
    files = get_files(directory)
    PhysData = apps.get_model('viz_app', 'PhysData')
    for smsFile in files:
        filenameElements = smsFile.split('_')
        participant = filenameElements[2][:-5]
        data = json.load(open(directory + '/' + smsFile, 'r'))
        for day_data in data:
            for measurement_key in MEASUREMENT_TYPE_SUFFIXES:
                category = MEASUREMENT_TYPE_SUFFIXES[measurement_key]
                for hour in range(24):
                    hour_id_string = str(hour) + '_to_' + str((hour+1)%24)
                    date_string = day_data["date"] + " 0" + str(hour) if hour <= 9 else day_data["date"] + " " + str(hour)
                    naive_date = datetime.datetime.strptime(date_string, DATE_FORMAT)
                    date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))

                    final_key = hour_id_string+measurement_key
                    measurement = day_data[final_key]
                    frequency = '1hr'
                    group = "Phone_Usage"
                    line = PhysData(name=participant,
                                    date=date,
                                    category=category,
                                    measurement=measurement,
                                    interval=frequency,
                                    group=group)
                    line.save()

                daily_key = 'daily' + measurement_key
                date_string = day_data["date"] + " 00"
                naive_date = datetime.datetime.strptime(date_string, DATE_FORMAT)
                date = timezone.make_aware(naive_date, tz.gettz('America/New_York'))

                measurement = day_data[daily_key]
                frequency = '24hrs'
                group = "Phone Usage"
                line = PhysData(name=participant,
                                date=date,
                                category=category,
                                measurement=measurement,
                                interval=frequency,
                                group=group)
                line.save()


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0023_auto_20181117_1243'),
    ]

    operations = [
        migrations.RunPython(populate_sms_data)
    ]
