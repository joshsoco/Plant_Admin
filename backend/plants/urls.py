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
]