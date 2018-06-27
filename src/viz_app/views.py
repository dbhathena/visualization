from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse

import json

from .models import PhysData

# Create your views here.

def index(request):
    names = PhysData.objects.distinct("name").order_by("name").values_list("name")
    names = [x[0] for x in names]
    context = {"names": names}
    return render(request, 'viz_app/index.html', context)


def study_trends(request):
    return render(request, 'viz_app/study_trends.html')


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


def get_data(request):
    name = request.GET.get("name")
    subject_data = list(PhysData.objects.filter(name=name).order_by("date").values("date", "measurement"))
    subject_data = [(x["date"].isoformat(), x["measurement"]) for x in subject_data]
    return HttpResponse(json.dumps({"subject_data": subject_data}))
