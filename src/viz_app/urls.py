from django.urls import path

from . import views
from django.contrib.auth import views as auth_views

app_name = 'viz_app'
urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('chart/study-trends/', views.study_trends, name='study_trends'),
    path('chart/weekly-trends/', views.weekly_trends, name='weekly_trends'),
    path('chart/daily-trends/', views.daily_trends, name='daily_trends'),
    path('chart/scatter-plot/', views.scatter_plot, name='scatter_plot'),
    path('chart/radar-chart/', views.radar_chart, name='radar_chart'),
    path('chart/word-cloud/', views.word_cloud, name='word_cloud'),
    path('chart/pie-chart/', views.pie_chart, name='pie_chart'),
    path('chart/stacked-bar-chart/', views.stacked_bar, name='stacked_bar_chart'),
    path('index/', views.index, name='index'),
    path('publications/', views.publications, name='publications'),
    path('team/', views.team, name='team'),
    path('faq/', views.faq, name='faq'),
    path('get-study-trends-data/', views.get_study_trends_data, name='get_study_trends_data'),
    path('get-weekly-trends-data/', views.get_weekly_trends_data, name='get_weekly_trends_data'),
    path('get-daily-trends-data/', views.get_daily_trends_data, name='get_daily_trends_data'),
    path('get-scatter-plot-data/', views.get_scatter_plot_data, name='get_scatter_plot_data'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout')
]