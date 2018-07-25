from django.shortcuts import render
from django.http import HttpResponse

import json

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
    group = request.GET.get("group")
    if group == "None":
        name = request.GET.get("name")
        subject_data = {"left": {"dates": [], "measurements": []},
                        "right": {"dates": [], "measurements": []},
                        None: {"dates": [], "measurements": []}
                        }
        raw_data = list(PhysData.objects
                        .filter(name=name, category=type, interval="24hrs")
                        .order_by("date")
                        .values("date", "measurement", "hand"))
        for x in raw_data:
            subject_data[x["hand"]]["dates"].append(x["date"].isoformat())
            subject_data[x["hand"]]["measurements"].append(x["measurement"])
        return HttpResponse(json.dumps({"subject_data": subject_data}))
    else :
        aggregation = request.GET.get("aggregation")
        aggregation_method = AGGREGATION_METHODS[aggregation]
        group_dictionary = GROUPINGS[group]
        if type in SEPARATE_HANDS:
            raw_data_left = {}
            raw_data_right = {}
            for participant in PARTICIPANTS:
                raw_data_left[participant] = list(PhysData.objects
                                                  .filter(name=participant, category=type, interval="24hrs", hand="left")
                                                  .order_by("date")
                                                  .values_list("measurement", flat=True))
                raw_data_right[participant] = list(PhysData.objects
                                                   .filter(name=participant, category=type, interval="24hrs", hand="right")
                                                   .order_by("date")
                                                   .values_list("measurement", flat=True))

            aggregate_data = {"left": {},
                              "right": {} }
            for subgroup in group_dictionary:
                subgroup_data_left = []
                subgroup_data_right = []
                for day in range(0, 56):
                    day_data_left = []
                    day_data_right = []
                    for participant in group_dictionary[subgroup]:
                        if (participant in raw_data_left
                                and day < len(raw_data_left[participant])
                                and raw_data_left[participant][day] is not None):
                            day_data_left.append(raw_data_left[participant][day])
                        if (participant in raw_data_right
                                and day < len(raw_data_right[participant])
                                and raw_data_right[participant][day] is not None):
                            day_data_right.append(raw_data_right[participant][day])
                    if not day_data_left:
                        subgroup_data_left.append(None)
                    else:
                        subgroup_data_left.append(aggregation_method(day_data_left))
                    if not day_data_right:
                        subgroup_data_right.append(None)
                    else:
                        subgroup_data_right.append(aggregation_method(day_data_right))
                aggregate_data["left"][subgroup] = subgroup_data_left
                aggregate_data["right"][subgroup] = subgroup_data_right

            print(aggregate_data)
            return HttpResponse(json.dumps({"aggregate_data": aggregate_data}))
        else:
            raw_data = {}
            for participant in PARTICIPANTS:
                participant_data = list(PhysData.objects
                                        .filter(name=participant, category=type, interval="24hrs")
                                        .order_by("date")
                                        .values_list("measurement", flat=True))
                raw_data[participant] = participant_data


            aggregate_data = {}         # dictionary mapping subgroup to list of daily data dictionaries
            for subgroup in group_dictionary:
                subgroup_data = []
                for day in range(0, 56):
                    day_data = []
                    for participant in group_dictionary[subgroup]:
                        if (participant in raw_data
                                and day < len(raw_data[participant])
                                and raw_data[participant][day] is not None):
                            day_data.append(raw_data[participant][day])
                    if not day_data:
                        subgroup_data.append(None)
                    else:
                        subgroup_data.append(aggregation_method(day_data))
                aggregate_data[subgroup] = subgroup_data

            print("Done")
            return HttpResponse(json.dumps({"aggregate_data": aggregate_data}))
