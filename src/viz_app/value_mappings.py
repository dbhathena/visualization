import statistics

GROUPINGS = {
    "All": {
        "All": ['M001', 'M002', 'M004', 'M005', 'M006', 'M008', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016',
                'M017', 'M020', 'M021', 'M022', 'M029', 'M030', 'M033', 'M034', 'M037', 'M039', 'M042',
                'M045', 'M047', 'M048', 'M049', 'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060']
    },
    "Depression": {
        "MDD": ['M004', 'M005', 'M006', 'M008', 'M011', 'M012', 'M013', 'M015', 'M016', 'M017', 'M020',
                'M022', 'M029', 'M030', 'M033', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048', 'M049',
                'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060'],
        "HC": ['M001', 'M002', 'M014', 'M021']
    },
    "Gender": {
        "Male": ['M005', 'M008', 'M015', 'M021', 'M030', 'M033', 'M039', 'M042', 'M053', 'M054', 'M056', 'M060'],
        "Female": ['M001', 'M002', 'M004', 'M006', 'M011', 'M012', 'M013', 'M014', 'M016', 'M017', 'M020', 'M022',
                   'M029', 'M034', 'M037', 'M045', 'M047', 'M048', 'M049', 'M050', 'M055', 'M057',
                   'M059']
    },
    "Marital": {
        "Single": ['M001', 'M004', 'M008', 'M011', 'M013', 'M014', 'M016', 'M017', 'M020', 'M021', 'M022',
                   'M029', 'M030', 'M033', 'M034', 'M037', 'M045', 'M047', 'M048', 'M049', 'M053', 'M055', 'M056',
                   'M059', 'M060'],
        "Married": ['M002', 'M006', 'M042', 'M050', 'M057'],
        "Divorced": ['M005', 'M012', 'M015', 'M039', 'M054']
    },
    "Employment": {
        "Working full-time": ['M001', 'M002', 'M004', 'M005', 'M014', 'M016', 'M020', 'M021', 'M037',
                              'M048', 'M053', 'M056', 'M059'],
        "Student": ['M008', 'M022', 'M029', 'M030'],
        "Working part-time": ['M006', 'M011', 'M039', 'M042', 'M045', 'M049'],
        "Unemployed, not disabled": ['M012', 'M013', 'M055', 'M060'],
        "Disabled": ['M015', 'M033', 'M034', 'M050', 'M054'],
        "Retired": ['M017', 'M057'],
        "Housewife/Househusband": ['M047']
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
        "No": ['M001', 'M002', 'M004', 'M005', 'M012', 'M013', 'M014', 'M021', 'M022', 'M037', 'M053', 'M054', 'M056'],
        "Yes": ['M006', 'M008', 'M011', 'M015', 'M016', 'M017', 'M018', 'M020', 'M029', 'M030', 'M033', 'M034', 'M039',
                'M042', 'M045', 'M048', 'M049', 'M050', 'M055', 'M057', 'M059', 'M060']
    },
    "Episode Length": {
        "[0, 6]": ['M001', 'M008', 'M014', 'M015', 'M016', 'M017', 'M021', 'M022', 'M029', 'M030', 'M039', 'M047',
                   'M049', 'M054', 'M059'],
        "[6, 12]": ['M013'],
        "[12, 24]": ['M004', 'M037', 'M045', 'M048', 'M055', 'M057'],
        "[24, 36]": ['M012'],
        "[36, 1000]": ['M011', 'M033', 'M034', 'M056', 'M060']
    },
    "Episode Type": {
        "Recurrent": ['M005', 'M006', 'M008', 'M012', 'M013', 'M015', 'M016', 'M017', 'M022', 'M029',
                      'M030', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048', 'M049', 'M050',
                      'M053', 'M055', 'M060'],
        "Single": ['M011', 'M020', 'M033', 'M054', 'M056', 'M057']
    },
    "Phobia": {
        "No": ['M001', 'M002', 'M004', 'M005', 'M008', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017',
               'M020', 'M021', 'M022', 'M029', 'M033', 'M039', 'M045', 'M047', 'M049', 'M054', 'M055',
               'M057', 'M059'],
        "Yes": ['M006', 'M011', 'M034', 'M042', 'M048', 'M050', 'M056', 'M060']
    },
    "Anxiety": {
        "No": ['M001', 'M002', 'M005', 'M006', 'M011', 'M012', 'M014', 'M017', 'M021', 'M022',
               'M029', 'M033', 'M042', 'M047', 'M049', 'M054', 'M056', 'M057', 'M060'],
        "Yes": ['M004', 'M008', 'M013', 'M015', 'M016', 'M020', 'M034', 'M045', 'M048', 'M050',
                'M053', 'M055', 'M059']
    },
    "Current Medication": {
        "No": ['M001', 'M002', 'M008', 'M011', 'M014', 'M021', 'M029', 'M034', 'M050', 'M053', 'M055', 'M059'],
        "Yes": ['M004', 'M005', 'M006', 'M012', 'M013', 'M015', 'M016', 'M017', 'M020', 'M022', 'M030',
                'M033', 'M039', 'M042', 'M045', 'M047', 'M049', 'M054', 'M056', 'M057', 'M060']
    },
    "New Medication": {
        "No": ['M001', 'M008', 'M021', 'M053', 'M054'],
        "Yes": ['M002', 'M004', 'M005', 'M006', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017', 'M018',
                'M020', 'M022', 'M029', 'M030', 'M033', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048',
                'M049', 'M056']
    }
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

CATEGORY_MAPPING = {
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
    ]
}

CATEGORIES = {
    'Activity': 'Activity',
    'Physiology': 'Physiology',
    'Phone_Usage': 'Phone Usage',
}