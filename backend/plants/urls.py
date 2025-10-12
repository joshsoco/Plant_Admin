from django.urls import path
from . import views

urlpatterns = [
    # Mobile app endpoints
    path('predict/', views.predict_plant, name='predict_plant'),
    path('random/', views.random_plants, name='random_plants'),
    path('species/', views.get_plant_species, name='get_plant_species'),
    
    # Admin dashboard endpoints
    path('admin/identifications/', views.get_plant_identifications, name='admin_plant_identifications'),
    path('admin/stats/', views.get_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/analytics/', views.get_analytics_data, name='admin_analytics_data'),

    # Analytics endpoints
    path('analytics/', views.get_analytics, name='analytics'),
    path('time-series/', views.get_time_series, name='time-series'),
    path('top-searched/', views.get_top_searched, name='top-searched'),
    path('flagged/', views.get_flagged_cases, name='flagged-cases'),
    path('summary/', views.get_summary, name='summary'),
    
    # Plant CRUD endpoints
    path('', views.plant_list_create, name='plant-list-create'),
    path('api/plants/<str:plant_id>/', views.plant_detail, name='plant-detail'),
    path('api/plants/tags/available/', views.get_available_tags, name='available-tags'),
]