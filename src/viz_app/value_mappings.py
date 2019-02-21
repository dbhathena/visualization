import statistics
from .models import *


PARTICIPANTS = ['M001', 'M002', 'M004', 'M005', 'M006', 'M008', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017',
                'M020', 'M021', 'M022', 'M029', 'M030', 'M033', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048',
                'M049', 'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060']

DATABASE_MAPPING = {
    PhysData: {'Accelerometer', 'Motion', 'Heart Rate', 'Temperature', 'EDA Mean Difference', 'EDA Mean',
               'Skin Conductance Response'},
    PhoneData: {'Incoming Call Count', 'Incoming Call Mean Duration', 'Incoming Call Median Duration',
                'Incoming Call Std Duration', 'Incoming Call Sum Duration', 'Outgoing Call Count',
                'Outgoing Call Mean Duration', 'Outgoing Call Median Duration', 'Outgoing Call Std Duration',
                'Outgoing Call Sum Duration', 'Screen On Count', 'Screen On Mean Duration', 'Screen On Median Duration',
                'Screen On Std Duration', 'Screen On Sum Duration', 'Incoming SMS Count', 'Incoming SMS Mean Length',
                'Incoming SMS Median Length', 'Incoming SMS Std Length', 'Incoming SMS Sum Length', 'Outgoing SMS Count',
                'Outgoing SMS Mean Length', 'Outgoing SMS Median Length', 'Outgoing SMS Std Length',
                'Outgoing SMS Sum Length', 'Latitude Std', 'Latitude Stationary Std', 'Longitude Std',
                'Longitude Stationary Std', 'Average Location Std', 'Average Stationary Std', 'Home Stay',
                'Total Distance', 'Transition Time'},
    WeatherData: {'Insolation Seconds', 'Precipitation Intensity', 'Apparent Temperature High'},
    SleepData: {'Recorded Sleep'}
}

GROUPINGS = {
    "All": {
        "All": ['M001', 'M002', 'M004', 'M005', 'M006', 'M008', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017',
                'M020', 'M021', 'M022', 'M029', 'M030', 'M033', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048',
                'M049', 'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060']
    },
    "Depression": {
        "HC": ['M001', 'M002', 'M014', 'M021'],
        "MDD": ['M004', 'M005', 'M006', 'M008', 'M011', 'M012', 'M013', 'M015', 'M016', 'M017', 'M020', 'M022', 'M029',
                'M030', 'M033', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048', 'M049', 'M050', 'M053', 'M054',
                'M055', 'M056', 'M057', 'M059', 'M060']
    },
    "Gender": {
        "Female": ['M001', 'M002', 'M004', 'M006', 'M011', 'M012', 'M013', 'M014', 'M016', 'M017', 'M020', 'M022',
                   'M029', 'M034', 'M037', 'M045', 'M047', 'M048', 'M049', 'M050', 'M055', 'M057',  'M059'],
        "Male": ['M005', 'M008', 'M015', 'M021', 'M030', 'M033', 'M039', 'M042', 'M053', 'M054', 'M056', 'M060']
    },
    "Marital": {
        "Divorced": ['M005', 'M012', 'M015', 'M039', 'M054'],
        "Married": ['M002', 'M006', 'M042', 'M050', 'M057'],
        "Single": ['M001', 'M004', 'M008', 'M011', 'M013', 'M014', 'M016', 'M017', 'M020', 'M021', 'M022', 'M029',
                   'M030', 'M033', 'M034', 'M037', 'M045', 'M047', 'M048', 'M049', 'M053', 'M055', 'M056', 'M059',
                   'M060']
    },
    "Employment": {
        "Disabled": ['M015', 'M033', 'M034', 'M050', 'M054'],
        "Housewife/househusband": ['M047'],
        "Retired": ['M017', 'M057'],
        "Student": ['M008', 'M022', 'M029', 'M030'],
        "Unemployed, not disabled": ['M012', 'M013', 'M060'],
        "Working full-time": ['M001', 'M002', 'M004', 'M005', 'M014', 'M016', 'M020', 'M021', 'M037', 'M048', 'M053',
                              'M056', 'M059'],
        "Working part-time": ['M006', 'M011', 'M039', 'M042', 'M045', 'M049']
    },
    "Age": {
        "[18, 25]": ['M001', 'M002', 'M004', 'M008', 'M011', 'M013', 'M016', 'M030', 'M034', 'M037', 'M045', 'M053',
                     'M059'],
        "[25, 35]": ['M014', 'M021', 'M029', 'M047', 'M048', 'M049', 'M055', 'M056', 'M060'],
        "[35, 45]": ['M006', 'M039', 'M042', 'M050', 'M054'],
        "[45, 55]": ['M005', 'M012', 'M020', 'M022'],
        "[55, 80]": ['M015', 'M017', 'M033', 'M057']
    },
    "Psychotherapy": {
        "Yes": ['M006', 'M008', 'M011', 'M015', 'M016', 'M017', 'M020', 'M029', 'M030', 'M033', 'M034', 'M039', 'M042',
                'M045', 'M048', 'M049', 'M050', 'M055', 'M057', 'M059', 'M060'],
        "No": ['M001', 'M002', 'M004', 'M005', 'M012', 'M013', 'M014', 'M021', 'M022', 'M037', 'M047', 'M053', 'M054',
               'M056']
    },
    "Episode Length": {
        "[0]": ['M001', 'M002' 'M014', 'M021'],
        "[1, 6]": ['M008', 'M015', 'M016', 'M017', 'M022', 'M029', 'M030', 'M039', 'M047', 'M049', 'M050', 'M054',
                   'M059'],
        "[6, 12]": ['M013'],
        "[12, 24]": ['M004', 'M037', 'M045', 'M048', 'M055', 'M057'],
        "[24, 36]": ['M012'],
        "[36, 1000]": ['M011', 'M033', 'M034', 'M056', 'M060']
    },
    "Episode Type": {
        "Single": ['M004', 'M011', 'M020', 'M033', 'M054', 'M056', 'M057'],
        "Recurrent": ['M005', 'M006', 'M008', 'M012', 'M013', 'M015', 'M016', 'M017', 'M022', 'M029', 'M030', 'M034',
                      'M037', 'M039', 'M042', 'M045', 'M047', 'M048', 'M049', 'M050', 'M053', 'M055', 'M060']
    },
    "Phobia": {
        "Yes": ['M006', 'M011', 'M034', 'M042', 'M048', 'M050', 'M056', 'M060'],
        "No": ['M001', 'M002', 'M004', 'M005', 'M008', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017', 'M020', 'M021',
               'M022', 'M029', 'M030', 'M033', 'M037', 'M039', 'M045', 'M047', 'M049', 'M053', 'M054', 'M055', 'M057',
               'M059']
    },
    "Anxiety": {
        "Yes": ['M004', 'M008', 'M013', 'M015', 'M016', 'M020', 'M034', 'M045', 'M048', 'M050', 'M053', 'M055', 'M059'],
        "No": ['M001', 'M002', 'M005', 'M006', 'M011', 'M012', 'M014', 'M017', 'M021', 'M022', 'M029', 'M030', 'M033',
               'M037', 'M039', 'M042', 'M047', 'M049', 'M054', 'M056', 'M057', 'M060']
    },
    "Current Medication": {
        "Yes": ['M004', 'M005', 'M006', 'M012', 'M013', 'M015', 'M016', 'M017', 'M020', 'M022', 'M030', 'M033', 'M037',
                'M039', 'M042', 'M045', 'M047', 'M048', 'M049', 'M054', 'M056', 'M057', 'M060'],
        "No": ['M001', 'M002', 'M008', 'M011', 'M014', 'M021', 'M029', 'M034', 'M050', 'M053', 'M055', 'M059']
    },
}

AGGREGATION_METHODS = {
    "Mean": statistics.mean,
    "Median": statistics.median,
    "Max": max,
    "Min": min,
    "Std Dev": statistics.pstdev
}

SEPARATE_HANDS = {"Temperature",
                  'EDA Mean',
                  'Skin Conductance Response'}


MEASUREMENT_THRESHOLDS = {"Accelerometer": (0, 1),
                          "Heart Rate": (0, 160),
                          "Motion": (0, 1),
                          "Temperature": (20, 40),
                          }

CATEGORY_MAPPING_DAILY = {
    'Activity': ['Accelerometer',
                 'Motion'],
    'Physiology': ['Heart Rate',
                   'Temperature',
                   'EDA Mean Difference',
                   'EDA Mean',
                   'Skin Conductance Response'],
    'Phone_Usage': ['Incoming Call Count',
                    'Incoming Call Mean Duration',
                    'Incoming Call Median Duration',
                    'Incoming Call Std Duration',
                    'Incoming Call Sum Duration',
                    'Outgoing Call Count',
                    'Outgoing Call Mean Duration',
                    'Outgoing Call Median Duration',
                    'Outgoing Call Std Duration',
                    'Outgoing Call Sum Duration',
                    'Screen On Count',
                    'Screen On Mean Duration',
                    'Screen On Median Duration',
                    'Screen On Std Duration',
                    'Screen On Sum Duration',
                    'Incoming SMS Count',
                    'Incoming SMS Mean Length',
                    'Incoming SMS Median Length',
                    'Incoming SMS Std Length',
                    'Incoming SMS Sum Length',
                    'Outgoing SMS Count',
                    'Outgoing SMS Mean Length',
                    'Outgoing SMS Median Length',
                    'Outgoing SMS Std Length',
                    'Outgoing SMS Sum Length'],
    "Location": ['Latitude Std',
                 'Latitude Stationary Std',
                 'Longitude Std',
                 'Longitude Stationary Std',
                 'Average Location Std',
                 'Average Stationary Std',
                 'Home Stay',
                 'Total Distance',
                 'Transition Time'],
    "Weather": ['Insolation Seconds',
                'Precipitation Intensity',
                'Apparent Temperature High']
}

CATEGORY_MAPPING_HOURLY = {
    'Activity': ['Accelerometer',
                 'Motion'],
    'Physiology': ['Heart Rate',
                   'Temperature',
                   'EDA Mean Difference',
                   'EDA Mean',
                   'Skin Conductance Response'],
    'Phone_Usage': ['Incoming Call Count',
                    'Incoming Call Mean Duration',
                    'Incoming Call Median Duration',
                    'Incoming Call Std Duration',
                    'Incoming Call Sum Duration',
                    'Outgoing Call Count',
                    'Outgoing Call Mean Duration',
                    'Outgoing Call Median Duration',
                    'Outgoing Call Std Duration',
                    'Outgoing Call Sum Duration',
                    'Screen On Count',
                    'Screen On Mean Duration',
                    'Screen On Median Duration',
                    'Screen On Std Duration',
                    'Screen On Sum Duration',
                    'Incoming SMS Count',
                    'Incoming SMS Mean Length',
                    'Incoming SMS Median Length',
                    'Incoming SMS Std Length',
                    'Incoming SMS Sum Length',
                    'Outgoing SMS Count',
                    'Outgoing SMS Mean Length',
                    'Outgoing SMS Median Length',
                    'Outgoing SMS Std Length',
                    'Outgoing SMS Sum Length'],
    "Location": ['Latitude Std',
                 'Latitude Stationary Std',
                 'Longitude Std',
                 'Longitude Stationary Std',
                 'Average Location Std',
                 'Average Stationary Std',
                 'Home Stay',
                 'Total Distance',
                 'Transition Time']
}

CATEGORIES_DAILY = {
    'Activity': 'Activity',
    'Physiology': 'Physiology',
    'Phone_Usage': 'Phone Usage',
    'Location': 'Location',
    'Weather': 'Weather'
}

CATEGORIES_HOURLY = {
    'Activity': 'Activity',
    'Physiology': 'Physiology',
    'Phone_Usage': 'Phone Usage',
    'Location': 'Location'
}