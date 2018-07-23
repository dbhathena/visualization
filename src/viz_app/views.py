from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse

import json
import statistics

from .models import PhysData

# Create your views here.

PARTICIPANTS = [x[0] for x in PhysData.objects.distinct("name").order_by("name").values_list("name")]
TYPES = [x[0] for x in PhysData.objects.distinct("category").order_by("category").values_list("category")]
ALL = {
    "ALL": ['M001', 'M002', 'M004', 'M005', 'M006', 'M007', 'M008', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016',
            'M017', 'M018', 'M020', 'M021', 'M022', 'M029', 'M030', 'M031', 'M033', 'M034', 'M037', 'M039', 'M042',
            'M045', 'M047', 'M048', 'M049', 'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060']
}
DEPRESSION = {
    "MDD": ['M004', 'M005', 'M006', 'M007', 'M008', 'M011', 'M012', 'M013', 'M015', 'M016', 'M017', 'M018', 'M020',
            'M022', 'M029', 'M030', 'M031', 'M033', 'M034', 'M037', 'M039', 'M042', 'M045', 'M047', 'M048', 'M049',
            'M050', 'M053', 'M054', 'M055', 'M056', 'M057', 'M059', 'M060'],
    "HC": ['M001', 'M002', 'M014', 'M021', 'M028']
}
GENDER = {
    "Male": ['M005', 'M007', 'M008', 'M015', 'M021', 'M030', 'M033', 'M039', 'M042', 'M053', 'M054', 'M056', 'M060'],
    "Female": ['M001', 'M002', 'M004', 'M006', 'M011', 'M012', 'M013', 'M014', 'M016', 'M017', 'M018', 'M020', 'M022',
               'M029', 'M031', 'M034', 'M035', 'M037', 'M045', 'M047', 'M048', 'M049', 'M050', 'M051', 'M055', 'M057',
               'M058', 'M059']
}
MARITAL = {
    "Single": ['M001', 'M004', 'M007', 'M008', 'M011', 'M013', 'M014', 'M016', 'M017', 'M019', 'M020', 'M021', 'M022',
               'M029', 'M030', 'M033', 'M034', 'M037', 'M045', 'M047', 'M048', 'M049', 'M051', 'M053', 'M055', 'M056',
               'M058', 'M059', 'M060'],
    "Married": ['M002', 'M006', 'M018', 'M031', 'M042', 'M050', 'M057'],
    "Divorced": ['M005', 'M012', 'M015', 'M039', 'M054']
}
EMPLOYMENT = {
    "Working full-time": ['M001', 'M002', 'M004', 'M005', 'M014', 'M016', 'M020', 'M021', 'M024', 'M031', 'M037',
                          'M048', 'M053', 'M056', 'M059'],
    "Student": ['M008', 'M022', 'M029', 'M030', 'M051'],
    "Working part-time": ['M006', 'M007', 'M011', 'M018', 'M039', 'M042', 'M045', 'M049', 'M058'],
    "Unemployed, not disabled": ['M012', 'M013', 'M055', 'M060'],
    "Disabled": ['M015', 'M033', 'M034', 'M050', 'M054'],
    "Retired": ['M017', 'M057'],
    "Housewife/Househusband": ['M047']
}
AGE = {
    "[18, 25]": ['M001', 'M002', 'M004', 'M008', 'M011', 'M013', 'M016', 'M030', 'M034', 'M037', 'M045', 'M051', 'M053',
                 'M058', 'M059'],
    "[25, 35]": ['M014', 'M021', 'M029', 'M047', 'M048', 'M049', 'M055', 'M056', 'M060'],
    "[35, 45]": ['M006', 'M018', 'M039', 'M042', 'M050', 'M054'],
    "[45, 55]": ['M005', 'M012', 'M020', 'M022', 'M041'],
    "[55, 80]": ['M007', 'M015', 'M017', 'M031', 'M033', 'M057']
}
PSYCHOTHERAPY = {
    "No": ['M001', 'M002', 'M004', 'M005', 'M012', 'M013', 'M014', 'M021', 'M022', 'M031', 'M037', 'M053', 'M054',
           'M056'],
    "Yes": ['M006', 'M007', 'M008', 'M011', 'M015', 'M016', 'M017', 'M018', 'M020', 'M029', 'M030', 'M033', 'M034',
            'M039', 'M042', 'M045', 'M048', 'M049', 'M050', 'M051', 'M055', 'M057', 'M058', 'M059', 'M060']
}
EPISODE_LENGTH = {
    "[0, 6]": ['M001', 'M007', 'M008', 'M014', 'M015', 'M016', 'M017', 'M018', 'M021', 'M022', 'M025', 'M029', 'M030',
               'M031', 'M039', 'M047', 'M049', 'M051', 'M054', 'M059'],
    "[6, 12]": ['M013', 'M058'],
    "[12, 24]": ['M004', 'M037', 'M045', 'M048', 'M055', 'M057'],
    "[24, 36]": ['M012'],
    "[36, 1000]": ['M011', 'M033', 'M034', 'M056', 'M060']
}
EPISODE_TYPE = {
    "Recurrent": ['M00m5', 'M006', 'M007', 'M008', 'M012', 'M013', 'M015', 'M016', 'M017', 'M018', 'M022', 'M029',
                  'M030', 'M031', 'M034', 'M037', 'M039', 'M042', 'M045', 'M046', 'M047', 'M048', 'M049', 'M050',
                  'M053', 'M055', 'M060'],
    "Single": ['M011', 'M020', 'M033', 'M054', 'M056', 'M057']
}
PHOBIA = {
    "No": ['M001', 'M002', 'M004', 'M005', 'M007', 'M008', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017', 'M018',
           'M020', 'M021', 'M022', 'M029', 'M031', 'M033', 'M039', 'M045', 'M046', 'M047', 'M049', 'M054', 'M055',
           'M057', 'M059'],
    "Yes": ['M006', 'M011', 'M034', 'M042', 'M048', 'M050', 'M056', 'M060']
}
ANXIETY = {
    "No": ['M001', 'M002', 'M004', 'M005', 'M007', 'M008', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017', 'M018',
           'M020', 'M021', 'M022', 'M029', 'M031', 'M033', 'M039', 'M045', 'M046', 'M047', 'M049', 'M054', 'M055',
           'M057', 'M059'],
    "Yes": ['M006', 'M011', 'M034', 'M042', 'M048', 'M050', 'M056', 'M060']
}
CURRENT_MEDICATION ={
    "No": ['M001', 'M002', 'M008', 'M011', 'M014', 'M021', 'M029', 'M034', 'M050', 'M053', 'M055', 'M059'],
    "Yes": ['M004', 'M005', 'M006', 'M007', 'M012', 'M013', 'M015', 'M016', 'M017', 'M018', 'M020', 'M022', 'M030',
            'M031', 'M033', 'M039', 'M042', 'M045', 'M047', 'M049', 'M054', 'M056', 'M057', 'M060']
}
NEW_MEDICATION = {
    "No": ['M001', 'M008', 'M021', 'M053', 'M054'],
    "Yes": ['M002', 'M004', 'M005', 'M006', 'M007', 'M011', 'M012', 'M013', 'M014', 'M015', 'M016', 'M017', 'M018',
            'M020', 'M022', 'M029', 'M030', 'M031', 'M033', 'M037', 'M039', 'M041', 'M042', 'M045', 'M047', 'M048',
            'M049', 'M056']
}

def index(request):
    return render(request, 'viz_app/index.html')


def study_trends(request):
    context = {"names": PARTICIPANTS, "types": TYPES}
    return render(request, 'viz_app/study_trends.html', context)


def daily_trends(request):
    return render(request, 'viz_app/daily_trends.html')


def scatter_plot(request):
    return render(request, 'viz_app/scatter_plot.html')


def radar_chart(request):
    return render(request, 'viz_app/radar_chart.html')


def word_cloud(request):
    return render(request, 'viz_app/word_cloud.html')


def pie_chart(request):
    return render(request, 'viz_app/pie_chart.html')


def stacked_bar(request):
    return render(request, 'viz_app/stacked_bar.html')


def home(request):
    return render(request, 'viz_app/home.html')


def about(request):
    return render(request, 'viz_app/about.html')


def publications(request):
    return render(request, 'viz_app/publications.html')


def team(request):
    return render(request, 'viz_app/team.html')


def faq(request):
    return render(request, 'viz_app/faq.html')


def get_study_trends_data(request):
    type = request.GET.get("type")
    aggregation = request.GET.get("aggregation")
    if aggregation == "None":
        name = request.GET.get("name")
        subject_data = list(PhysData.objects.filter(name=name, category=type, interval="24hrs").order_by("date").values("date", "measurement"))
        subject_data = [{"date": x["date"].isoformat(), "measurement": x["measurement"]} for x in subject_data if x["measurement"] is not None]
        return HttpResponse(json.dumps({"subject_data": subject_data}))
    else :
        group = request.GET.get("group")

        raw_data = {}
        for participant in PARTICIPANTS:
            participant_data = list(PhysData.objects.filter(name=participant, category=type, interval="24hrs").order_by("date").values_list("measurement", flat=True))
            raw_data[participant] = participant_data

        if aggregation == "Mean":
            aggregation_method = statistics.mean
        elif aggregation == "Median":
            aggregation_method = statistics.median
        elif aggregation == "Max":
            aggregation_method = max
        elif aggregation == "Min":
            aggregation_method = min
        elif aggregation == "Std Dev":
            aggregation_method = statistics.pstdev
        else:
            raise ValueError('Unknown aggregation method')

        if group == "All":
            group_dictionary = ALL
        elif group == "Depression":
            group_dictionary = DEPRESSION
        elif group == "Gender":
            group_dictionary = GENDER
        elif group == "Marital":
            group_dictionary = MARITAL
        elif group == "Employment":
            group_dictionary = EMPLOYMENT
        elif group == "Age":
            group_dictionary = AGE
        elif group == "Psychotherapy":
            group_dictionary = PSYCHOTHERAPY
        elif group == "Episode Length":
            group_dictionary = EPISODE_LENGTH
        elif group == "Episode Type":
            group_dictionary = EPISODE_TYPE
        elif group == "Phobia":
            group_dictionary = PHOBIA
        elif group == "Anxiety":
            group_dictionary = ANXIETY
        elif group == "Current Medication":
            group_dictionary = CURRENT_MEDICATION
        elif group == "New Medication":
            group_dictionary = NEW_MEDICATION
        else:
            raise ValueError('Unknown group')

        # aggregate_data = []
        # if group == "All":
        #     for day in range(0, 56):
        #         day_data = []
        #         for participant in raw_data:
        #             if day < len(raw_data[participant]) and raw_data[participant][day] is not None:
        #                 day_data.append(raw_data[participant][day])
        #         aggregate_data.append({"date": day, "measurement": aggregation_method(day_data)})

        aggregate_data = {}         # dictionary mapping subgroup to list of daily data dictionaries
        for subgroup in group_dictionary:
            subgroup_data = []
            for day in range(0, 56):
                day_data = []
                for participant in group_dictionary[subgroup]:
                    if participant in raw_data and day < len(raw_data[participant]) and raw_data[participant][day] is not None:
                        day_data.append(raw_data[participant][day])
                if not day_data:
                    day_data = [0]
                subgroup_data.append({"date": day, "measurement": aggregation_method(day_data)})
            aggregate_data[subgroup] = subgroup_data

        return HttpResponse(json.dumps({"aggregate_data": aggregate_data}))
