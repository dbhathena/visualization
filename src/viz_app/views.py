from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required, permission_required
from django.db.models.functions import ExtractHour, ExtractWeekDay

import json

from .models import PhysData, PhoneData
from .value_mappings import *

# Create your views here.

@login_required
def index(request):
    return render(request, 'viz_app/index.html')


@login_required
def study_trends(request):
    context = {"names": PARTICIPANTS, "category_mapping": sorted(CATEGORY_MAPPING_DAILY.items()), "categories": sorted(CATEGORIES_DAILY.items())}
    return render(request, 'viz_app/study_trends.html', context)


@permission_required("viz_app.aggregation")
@login_required
def weekly_trends(request):
    context = {"category_mapping": sorted(CATEGORY_MAPPING_DAILY.items()), "categories":sorted(CATEGORIES_DAILY.items())}
    return render(request, 'viz_app/weekly_trends.html', context)


@login_required
def daily_trends(request):
    context = {"names": PARTICIPANTS, "category_mapping": sorted(CATEGORY_MAPPING_HOURLY.items()), "categories": sorted(CATEGORIES_HOURLY.items())}
    return render(request, 'viz_app/daily_trends.html', context)


@permission_required("viz_app.aggregation")
@login_required
def scatter_plot(request):
    context = {"category_mapping": sorted(CATEGORY_MAPPING_DAILY.items()), "categories": sorted(CATEGORIES_DAILY.items())}
    return render(request, 'viz_app/scatter_plot.html', context)


@login_required
def radar_chart(request):
    return render(request, 'viz_app/radar_chart.html')


@login_required
def word_cloud(request):
    return render(request, 'viz_app/word_cloud.html')


@login_required
def pie_chart(request):
    return render(request, 'viz_app/pie_chart.html')


@login_required
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


class LoginForm(forms.Form):
    username = forms.CharField(label='Username', widget=forms.TextInput(attrs={'class': 'form-input', 'id': 'id_username'}))
    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-input', 'id': 'id_password'}))


def login(request):
    if request.user.is_authenticated:
        print("User is authenticated")
        return HttpResponseRedirect(reverse('viz_app:home'))
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return HttpResponseRedirect(reverse('viz_app:home'))
            else:
                form.add_error('username', 'invalid auth')
    else:
        form = LoginForm()
    context = {'form': form, 'was_redirected': request.GET.get('next') != None}
    return render(request, 'registration/login.html', context)


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect(reverse('viz_app:home'))


@login_required
def get_study_trends_data(request):
    type = request.GET.get("type")
    group = request.GET.get("group")
    model = None
    for m in DATABASE_MAPPING:
        if type in DATABASE_MAPPING[m]:
            model = m
    assert model is not None
    if group == "None":
        name = request.GET.get("name")
        if type in SEPARATE_HANDS:
            subject_data = {"left": {"dates": [], "measurements": []},
                            "right": {"dates": [], "measurements": []},
                            }
            raw_data = list(model.objects
                            .filter(name=name,
                                    category=type,
                                    interval="24hrs")
                            .order_by("date")
                            .values("date", "measurement", "hand"))
            for x in raw_data:
                subject_data[x["hand"]]["dates"].append(x["date"].isoformat())
                subject_data[x["hand"]]["measurements"].append(x["measurement"])
            return HttpResponse(json.dumps({"subject_data": subject_data}))
        else:
            subject_data = {None: {"dates": [], "measurements": []},
                            }
            raw_data = list(model.objects
                            .filter(name=name,
                                    category=type,
                                    interval="24hrs")
                            .order_by("date")
                            .values("date", "measurement"))
            for x in raw_data:
                subject_data[None]["dates"].append(x["date"].isoformat())
                subject_data[None]["measurements"].append(x["measurement"])
            return HttpResponse(json.dumps({"subject_data": subject_data}))
    else:
        aggregation = request.GET.get("aggregation")
        aggregation_method = AGGREGATION_METHODS[aggregation]
        group_dictionary = GROUPINGS[group]
        if type in SEPARATE_HANDS:
            raw_data_left = {}
            raw_data_right = {}

            database_query =  model.objects.filter(category=type, interval="24hrs").order_by("date").values("name", "measurement", "hand")
            for datum in database_query:
                participant = datum["name"]
                hand = datum["hand"]
                if hand == "left":
                    if participant not in raw_data_left:
                        raw_data_left[participant] = []
                    raw_data_left[participant].append(datum["measurement"])
                else:
                    if participant not in raw_data_right:
                        raw_data_right[participant] = []
                    raw_data_right[participant].append(datum["measurement"])

            aggregate_data = {"left": {},
                              "right": {} }
            error_trace_by_subgroup = {"left": {},
                                       "right": {} }
            group_sizes = {}
            for subgroup in group_dictionary:
                group_sizes[subgroup] = model.objects.filter(category=type,
                                                             interval='24hrs',
                                                             measurement__isnull=False,
                                                             name__in=group_dictionary[subgroup]).distinct('name').count()
                subgroup_data_left = []
                subgroup_data_right = []
                subgroup_error_left = []
                subgroup_error_right = []
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
                        subgroup_error_left.append(None)
                    else:
                        subgroup_data_left.append(aggregation_method(day_data_left))
                        subgroup_error_left.append(statistics.pstdev(day_data_left))
                    if not day_data_right:
                        subgroup_data_right.append(None)
                        subgroup_error_right.append(None)
                    else:
                        subgroup_data_right.append(aggregation_method(day_data_right))
                        subgroup_error_right.append(statistics.pstdev(day_data_right))

                aggregate_data["left"][subgroup] = subgroup_data_left
                aggregate_data["right"][subgroup] = subgroup_data_right
                error_trace_by_subgroup["left"][subgroup] = get_error_trace_from_std_devs(subgroup_data_left, subgroup_error_left)
                error_trace_by_subgroup["right"][subgroup] = get_error_trace_from_std_devs(subgroup_data_right, subgroup_error_right)

            return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))

        else:
            raw_data = {}
            database_query = model.objects.filter(category=type, interval="24hrs").order_by("date").values("name", "measurement")
            for datum in database_query:
                participant = datum["name"]
                if participant not in raw_data:
                    raw_data[participant] = []
                raw_data[participant].append(datum["measurement"])

            aggregate_data = {}
            group_sizes = {}
            error_trace_by_subgroup = {}
            for subgroup in group_dictionary:
                group_sizes[subgroup] = model.objects.filter(category=type,
                                                             interval='24hrs',
                                                             measurement__isnull=False,
                                                             name__in=group_dictionary[subgroup]).distinct('name').count()
                subgroup_data = []
                subgroup_std_devs = []
                for day in range(0, 56):
                    day_data = []
                    for participant in group_dictionary[subgroup]:
                        if (participant in raw_data
                                and day < len(raw_data[participant])
                                and raw_data[participant][day] is not None):
                            day_data.append(raw_data[participant][day])
                    if not day_data:
                        subgroup_data.append(None)
                        subgroup_std_devs.append(None)
                    else:
                        subgroup_data.append(aggregation_method(day_data))
                        subgroup_std_devs.append(statistics.pstdev(day_data))
                aggregate_data[subgroup] = subgroup_data
                error_trace_by_subgroup[subgroup] = get_error_trace_from_std_devs(subgroup_data, subgroup_std_devs)

            return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))


@login_required
def get_weekly_trends_data(request):
    type = request.GET.get("type")
    group = request.GET.get("group")
    model = None
    for m in DATABASE_MAPPING:
        if type in DATABASE_MAPPING[m]:
            model = m
    assert model is not None
    aggregation = request.GET.get("aggregation")
    aggregation_method = AGGREGATION_METHODS[aggregation]
    group_dictionary = GROUPINGS[group]
    if type in SEPARATE_HANDS:
        raw_data_left = {}
        raw_data_right = {}
        database_query = model.objects.filter(category=type, interval="24hrs").order_by("hand", "name", "date").values("name", "measurement", "hand", weekday=ExtractWeekDay("date"))
        current_participant = database_query[0]["name"]
        isAfterFirstSunday = False
        isBeforeLastSaturday = True
        for i in range(len(database_query)):
            datum = database_query[i]
            if datum["name"] != current_participant:    # reached the next participant in the query
                current_participant = datum["name"]
                isAfterFirstSunday = False
                isBeforeLastSaturday = True

            # If we reach a Sunday, we must be after the first Sunday
            if datum["weekday"] == 1:
                isAfterFirstSunday = True

            # If the date is within the appropriate range, record the data
            if isAfterFirstSunday and isBeforeLastSaturday:
                hand = datum["hand"]
                if hand == "left":
                    if current_participant not in raw_data_left:
                        raw_data_left[current_participant] = []
                    raw_data_left[current_participant].append(datum["measurement"])
                else:
                    if current_participant not in raw_data_right:
                        raw_data_right[current_participant] = []
                    raw_data_right[current_participant].append(datum["measurement"])

            # If this was the last Saturday for this participant, we are no longer before the last Saturday
            if datum["weekday"] == 7:
                if i+7 > len(database_query) or database_query[i+7]["name"] != current_participant:
                    isBeforeLastSaturday = False

        aggregate_data = {"left": {},
                          "right": {} }
        error_trace_by_subgroup = {"left": {},
                                   "right": {} }
        group_sizes = {}
        for subgroup in group_dictionary:
            group_sizes[subgroup] = model.objects.filter(category=type,
                                                         interval="24hrs",
                                                         measurement__isnull=False,
                                                         name__in=group_dictionary[subgroup]).distinct('name').count()
            subgroup_data_left = []
            subgroup_data_right = []
            subgroup_error_left = []
            subgroup_error_right = []
            for day in range(0, 49):
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
                    subgroup_error_left.append(None)
                else:
                    subgroup_data_left.append(aggregation_method(day_data_left))
                    subgroup_error_left.append(statistics.pstdev(day_data_left))

                if not day_data_right:
                    subgroup_data_right.append(None)
                    subgroup_error_right.append(None)
                else:
                    subgroup_data_right.append(aggregation_method(day_data_right))
                    subgroup_error_right.append(statistics.pstdev(day_data_right))

            aggregate_data["left"][subgroup] = subgroup_data_left
            aggregate_data["right"][subgroup] = subgroup_data_right
            error_trace_by_subgroup["left"][subgroup] = get_error_trace_from_std_devs(subgroup_data_left, subgroup_error_left)
            error_trace_by_subgroup["right"][subgroup] = get_error_trace_from_std_devs(subgroup_data_right, subgroup_error_right)

        return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))

    else:
        raw_data = {}
        database_query = model.objects.filter(category=type, interval="24hrs").order_by("name", "date").values("name",
                                                                                                               "measurement",
                                                                                                               weekday=ExtractWeekDay(
                                                                                                                   "date"))
        current_participant = database_query[0]["name"]
        isAfterFirstSunday = False
        isBeforeLastSaturday = True
        for i in range(len(database_query)):
            datum = database_query[i]
            if datum["name"] != current_participant:  # reached the next participant in the query
                current_participant = datum["name"]
                isAfterFirstSunday = False
                isBeforeLastSaturday = True

            # If we reach a Sunday, we must be after the first Sunday
            if datum["weekday"] == 1:
                isAfterFirstSunday = True

            # If the date is within the appropriate range, record the data
            if isAfterFirstSunday and isBeforeLastSaturday:
                if current_participant not in raw_data:
                    raw_data[current_participant] = []
                raw_data[current_participant].append(datum["measurement"])

            # If this was the last Saturday for this participant, we are no longer before the last Saturday
            if datum["weekday"] == 7:  # Saturday
                if i+7 > len(database_query) or database_query[i+7]["name"] != current_participant:
                    isBeforeLastSaturday = False

        aggregate_data = {}
        group_sizes = {}
        error_trace_by_subgroup = {}
        for subgroup in group_dictionary:
            group_sizes[subgroup] = model.objects.filter(category=type,
                                                         interval='24hrs',
                                                         measurement__isnull=False,
                                                         name__in=group_dictionary[subgroup]).distinct("name").count()
            subgroup_data = []
            subgroup_std_devs = []
            for day in range(0, 49):
                day_data = []
                for participant in group_dictionary[subgroup]:
                    if (participant in raw_data
                            and day < len(raw_data[participant])
                            and raw_data[participant][day] is not None):
                        day_data.append(raw_data[participant][day])
                if not day_data:
                    subgroup_data.append(None)
                    subgroup_std_devs.append(None)
                else:
                    subgroup_data.append(aggregation_method(day_data))
                    subgroup_std_devs.append(statistics.pstdev(day_data))
            aggregate_data[subgroup] = subgroup_data
            error_trace_by_subgroup[subgroup] = get_error_trace_from_std_devs(subgroup_data, subgroup_std_devs)

        return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))


@login_required
def get_daily_trends_data(request):
    type = request.GET.get("type")
    model = None
    for m in DATABASE_MAPPING:
        if type in DATABASE_MAPPING[m]:
            model = m
    assert model is not None
    group = request.GET.get("group")
    if group == "None":
        name = request.GET.get("name")
        if type in SEPARATE_HANDS:
            subject_data = {"left": [], "right": []}
            for hour in range(0, 24):
                for hand in subject_data:
                    hour_data = list(model.objects
                                     .filter(name=name,
                                             category=type,
                                             interval="1hr",
                                             hand=hand,
                                             date__hour=hour,
                                             measurement__isnull=False)
                                     .values_list("measurement", flat=True))
                    if hour_data:
                        subject_data[hand].append(statistics.mean(hour_data))
                    else:
                        subject_data[hand].append(None)
        else:
            subject_data = {"both": []}
            for hour in range(0, 24):
                hour_data = list(model.objects
                                 .filter(name=name,
                                         category=type,
                                         interval="1hr",
                                         date__hour=hour,
                                         measurement__isnull=False)
                                 .values_list("measurement", flat=True))
                if hour_data:
                    subject_data["both"].append(statistics.mean(hour_data))
                else:
                    subject_data["both"].append(None)

        return HttpResponse(json.dumps({"subject_data": subject_data}))

    else:
        aggregation = request.GET.get("aggregation")
        aggregation_method = AGGREGATION_METHODS[aggregation]
        group_dictionary = GROUPINGS[group]

        if type in SEPARATE_HANDS:

            raw_data = {"left": {},
                        "right": {}}
            database_query = model.objects.filter(category=type,
                                                  interval="1hr",
                                                  measurement__isnull=False).values("name", "measurement", "hand", hour=ExtractHour("date"))
            for datum in database_query:
                participant = datum["name"]
                subgroup = None
                for sg in group_dictionary:
                    if participant in group_dictionary[sg]:
                        subgroup=sg
                        break
                if subgroup is None:
                    continue
                hour = datum["hour"]
                hand = datum["hand"]
                if subgroup not in raw_data[hand]:
                    raw_data[hand][subgroup] = {}
                if hour not in raw_data[hand][subgroup]:
                    raw_data[hand][subgroup][hour] = []
                raw_data[hand][subgroup][hour].append(datum["measurement"])

            aggregate_data = {"left": {},
                              "right": {} }
            error_trace_by_subgroup = {"left": {},
                                       "right": {} }
            group_sizes = {}
            for hand in {"left", "right"}:
                for subgroup in raw_data[hand]:
                    group_sizes[subgroup] = model.objects.filter(category=type,
                                                                 interval='1hr',
                                                                 measurement__isnull=False,
                                                                 name__in=group_dictionary[subgroup]).distinct('name').count()
                    subgroup_data = []
                    subgroup_std_devs = []
                    for hour in range(0, 24):
                        hour_data = raw_data[hand][subgroup][hour]
                        if hour_data:
                            subgroup_data.append(aggregation_method(hour_data))
                            subgroup_std_devs.append(statistics.pstdev(hour_data))
                        else:
                            subgroup_data.append(None)
                            subgroup_std_devs.append(None)
                    aggregate_data[hand][subgroup] = subgroup_data
                    error_trace_by_subgroup[hand][subgroup] = get_error_trace_from_std_devs(subgroup_data, subgroup_std_devs)

            return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))
        else:
            raw_data = {}
            database_query = model.objects.filter(category=type,
                                                  interval="1hr",
                                                  measurement__isnull=False).values("name", "measurement", hour=ExtractHour("date"))
            for datum in database_query:
                participant = datum["name"]
                subgroup = None
                for sg in group_dictionary:
                    if participant in group_dictionary[sg]:
                        subgroup = sg
                        break
                if subgroup is None:
                    continue
                hour = datum["hour"]
                if subgroup not in raw_data:
                    raw_data[subgroup] = {}
                if hour not in raw_data[subgroup]:
                    raw_data[subgroup][hour] = []
                raw_data[subgroup][hour].append(datum["measurement"])

            aggregate_data = {}
            error_trace_by_subgroup = {}
            group_sizes = {}
            for subgroup in raw_data:
                group_sizes[subgroup] = model.objects.filter(category=type,
                                                             interval='1hr',
                                                             measurement__isnull=False,
                                                             name__in=group_dictionary[subgroup]).distinct('name').count()
                subgroup_data = []
                subgroup_std_devs = []
                for hour in range(0, 24):
                    hour_data = raw_data[subgroup][hour]
                    if hour_data:
                        subgroup_data.append(aggregation_method(hour_data))
                        subgroup_std_devs.append(statistics.pstdev(hour_data))
                    else:
                        subgroup_data.append(None)
                        subgroup_std_devs.append(None)
                aggregate_data[subgroup] = subgroup_data
                error_trace_by_subgroup[subgroup] = get_error_trace_from_std_devs(subgroup_data, subgroup_std_devs)

            return HttpResponse(json.dumps({"aggregate_data": aggregate_data, "group_sizes": group_sizes, "error_traces": error_trace_by_subgroup}))


@login_required
def get_scatter_plot_data(request):
    x_axis = request.GET.get("x_axis")
    model_x = None
    for m in DATABASE_MAPPING:
        if x_axis in DATABASE_MAPPING[m]:
            model_x = m
    assert model_x is not None
    y_axis = request.GET.get("y_axis")
    model_y = None
    for m in DATABASE_MAPPING:
        if y_axis in DATABASE_MAPPING[m]:
            model_y = m
    assert model_y is not None
    group = request.GET.get("group")
    group_dictionary = GROUPINGS[group]
    if x_axis in SEPARATE_HANDS or y_axis in SEPARATE_HANDS:
        data = {}
        group_sizes = {}
        for subgroup in group_dictionary:
            group_sizes[subgroup] = max(model_x.objects.filter(category=x_axis,
                                                               interval='24hrs',
                                                               measurement__isnull=False,
                                                               name__in=group_dictionary[subgroup]).distinct('name').count(),
                                        model_y.objects.filter(category=y_axis,
                                                               interval='24hrs',
                                                               measurement__isnull=False,
                                                               name__in=group_dictionary[subgroup]).distinct('name').count()
                                        )
            if (x_axis in SEPARATE_HANDS):
                x_data_left = list(model_x.objects
                                   .filter(name__in=group_dictionary[subgroup],
                                           category=x_axis,
                                           interval="24hrs",
                                           hand="left")
                                   .order_by("date", "name")
                                   .values_list("measurement", flat=True))
                x_data_right = list(model_x.objects
                                   .filter(name__in=group_dictionary[subgroup],
                                           category=x_axis,
                                           interval="24hrs",
                                           hand="right")
                                   .order_by("date", "name")
                                   .values_list("measurement", flat=True))
                x_data = {"left": x_data_left, "right": x_data_right}
            else:
                x_data_both = list(model_x.objects
                              .filter(name__in=group_dictionary[subgroup],
                                      category=x_axis,
                                      interval="24hrs")
                              .order_by("date", "name")
                              .values_list("measurement", flat=True))
                x_data = {"left": x_data_both, "right": x_data_both}
            if (y_axis in SEPARATE_HANDS):
                y_data_left = list(model_y.objects
                                   .filter(name__in=group_dictionary[subgroup],
                                           category=y_axis,
                                           interval="24hrs",
                                           hand="left")
                                   .order_by("date", "name")
                                   .values_list("measurement", flat=True))
                y_data_right = list(model_y.objects
                                   .filter(name__in=group_dictionary[subgroup],
                                           category=y_axis,
                                           interval="24hrs",
                                           hand="right")
                                   .order_by("date", "name")
                                   .values_list("measurement", flat=True))
                y_data = {"left": y_data_left, "right": y_data_right}
            else:
                y_data_both = list(model_y.objects
                              .filter(name__in=group_dictionary[subgroup],
                                      category=y_axis,
                                      interval="24hrs")
                              .order_by("date", "name")
                              .values_list("measurement", flat=True))
                y_data = {"left": y_data_both, "right": y_data_both}
            data[subgroup] = {"x": x_data, "y": y_data}
        return HttpResponse(json.dumps({"scatter_data": data, "group_sizes": group_sizes}))
    else:
        data = {}
        group_sizes = {}
        for subgroup in group_dictionary:
            group_sizes[subgroup] = max(model_x.objects.filter(category=x_axis,
                                                                interval='24hrs',
                                                                measurement__isnull=False,
                                                                name__in=group_dictionary[subgroup]).distinct('name').count(),
                                        model_y.objects.filter(category=y_axis,
                                                                 interval='24hrs',
                                                                 measurement__isnull=False,
                                                                 name__in=group_dictionary[subgroup]).distinct('name').count()
                                        )
            x_data = list(model_x.objects
                          .filter(name__in=group_dictionary[subgroup],
                                  category=x_axis,
                                  interval="24hrs")
                          .order_by("date", "name")
                          .values_list("measurement", flat=True))
            y_data = list(model_y.objects
                          .filter(name__in=group_dictionary[subgroup],
                                  category=y_axis,
                                  interval="24hrs")
                          .order_by("date", "name")
                          .values_list("measurement", flat=True))
            data[subgroup] = {"x": x_data, "y": y_data}
        return HttpResponse(json.dumps({"scatter_data": data, "group_sizes": group_sizes}))


def get_error_trace_from_std_devs(subgroup_data, subgroup_std_devs):
    assert len(subgroup_data) == len(subgroup_std_devs)

    upper_y_error = []
    lower_y_error = []
    x_forward = []
    for i in range(len(subgroup_data)):
        data_point = subgroup_data[i]
        std_dev = subgroup_std_devs[i]
        if std_dev is not None:
            upper_y_error.append(data_point + std_dev)
            lower_y_error.append(data_point - std_dev)
            x_forward.append(i)
    x = x_forward + list(reversed(x_forward))
    y = upper_y_error + list(reversed(lower_y_error))
    return {'x': x, 'y': y}


def get_viewing_permission(request):
    user = request.user
    if user.has_perm('viz_app.aggregate'):
        if user.has_perm('viz_app.individual'):
            return HttpResponse(json.dumps({"user": "researcher"}))
        else:
            return HttpResponse(json.dumps({"user": "viewer"}))
    else:
        if user.has_perm('viz_app.individual'):
            return HttpResponse(json.dumps({"user": "participant"}))
        else:
            raise PermissionError('User has no data-viewing permissions!')

