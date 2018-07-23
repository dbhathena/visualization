from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse

import json
import statistics

from .models import PhysData
from .value_mappings import *

# Create your views here.

PARTICIPANTS = [x[0] for x in PhysData.objects.distinct("name").order_by("name").values_list("name")]
TYPES = [x[0] for x in PhysData.objects.distinct("category").order_by("category").values_list("category")]

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
        raw_data = list(PhysData.objects.filter(name=name, category=type, interval="24hrs").order_by("date").values("date", "measurement"))
        dates = [x["date"].isoformat() for x in raw_data if x["measurement"] is not None]
        measurements = [x["measurement"] for x in raw_data if x["measurement"] is not None]
        subject_data = {"dates": dates, "measurements": measurements}
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
            group_dictionary = Groupings.ALL
        elif group == "Depression":
            group_dictionary = Groupings.DEPRESSION
        elif group == "Gender":
            group_dictionary = Groupings.GENDER
        elif group == "Marital":
            group_dictionary = Groupings.MARITAL
        elif group == "Employment":
            group_dictionary = Groupings.EMPLOYMENT
        elif group == "Age":
            group_dictionary = Groupings.AGE
        elif group == "Psychotherapy":
            group_dictionary = Groupings.PSYCHOTHERAPY
        elif group == "Episode Length":
            group_dictionary = Groupings.EPISODE_LENGTH
        elif group == "Episode Type":
            group_dictionary = Groupings.EPISODE_TYPE
        elif group == "Phobia":
            group_dictionary = Groupings.PHOBIA
        elif group == "Anxiety":
            group_dictionary = Groupings.ANXIETY
        elif group == "Current Medication":
            group_dictionary = Groupings.CURRENT_MEDICATION
        elif group == "New Medication":
            group_dictionary = Groupings.NEW_MEDICATION
        else:
            raise ValueError('Unknown group')

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
                subgroup_data.append(aggregation_method(day_data))
            aggregate_data[subgroup] = subgroup_data

        return HttpResponse(json.dumps({"aggregate_data": aggregate_data}))
