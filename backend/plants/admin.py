from django.contrib import admin
from .models import PlantSpecies, PlantIdentification, UserPlantCollection


@admin.register(PlantSpecies)
class PlantSpeciesAdmin(admin.ModelAdmin):
    list_display = ['common_name', 'scientific_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['common_name', 'scientific_name']
    ordering = ['common_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PlantIdentification)
class PlantIdentificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'predicted_name', 'confidence_percentage', 'location', 'created_at']
    list_filter = ['created_at', 'confidence_score', 'is_correct']
    search_fields = ['user__username', 'predicted_name', 'location']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'confidence_percentage']
    
    def confidence_percentage(self, obj):
        return f"{obj.confidence_percentage}%"
    confidence_percentage.short_description = "Confidence"


@admin.register(UserPlantCollection)
class UserPlantCollectionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plant_species', 'nickname', 'date_added']
    list_filter = ['date_added']
    search_fields = ['user__username', 'plant_species__common_name', 'nickname']
    ordering = ['-date_added']
