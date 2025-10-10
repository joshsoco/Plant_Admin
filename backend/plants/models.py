from django.db import models
from django.contrib.auth.models import User


class PlantSpecies(models.Model):
    """Model to store plant species information"""
    common_name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    care_instructions = models.TextField(blank=True)
    image = models.ImageField(upload_to='plant_species/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Plant Species"
        verbose_name_plural = "Plant Species"
        ordering = ['common_name']

    def __str__(self):
        return f"{self.common_name} ({self.scientific_name})"


class PlantIdentification(models.Model):
    """Model to store plant identifications made by users through mobile app"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plant_identifications')
    image = models.ImageField(upload_to='plant_identifications/%Y/%m/%d/')
    identified_species = models.ForeignKey(PlantSpecies, on_delete=models.SET_NULL, null=True, blank=True)
    predicted_name = models.CharField(max_length=200)  # AI prediction result
    confidence_score = models.FloatField(default=0.0)  # Confidence percentage (0.0 to 1.0)
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_correct = models.BooleanField(null=True, blank=True)  # User feedback on accuracy

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Plant Identification"
        verbose_name_plural = "Plant Identifications"

    def __str__(self):
        return f"{self.user.username} - {self.predicted_name} ({self.created_at.date()})"

    @property
    def confidence_percentage(self):
        """Return confidence as percentage"""
        return round(self.confidence_score * 100, 1)


class UserPlantCollection(models.Model):
    """Model for users to save plants to their personal collection"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plant_collection')
    plant_species = models.ForeignKey(PlantSpecies, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=100, blank=True)  # User's custom name for their plant
    date_added = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'plant_species')
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.user.username}'s {self.nickname or self.plant_species.common_name}"
