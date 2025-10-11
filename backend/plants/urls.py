from django.urls import path
from . import views

urlpatterns = [
    # Mobile app endpoints
    path('predict/', views.predict_plant, name='predict_plant'),
    path('random/', views.random_plants, name='random_plants'),
    
    # Admin dashboard endpoints
    path('admin/identifications/', views.get_plant_identifications, name='admin_plant_identifications'),
    path('admin/stats/', views.get_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/analytics/', views.get_analytics_data, name='admin_analytics_data'),
    path('admin/reports/', views.get_identification_reports, name='admin_reports'),
    path('admin/export/', views.export_identification_data, name='admin_export_data'),
]