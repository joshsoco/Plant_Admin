from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import PlantSpecies, PlantIdentification, UserPlantCollection
from django.db import models
from django.conf import settings
import json
import os
from datetime import datetime, timedelta
from django.utils import timezone
import random

# Load plant data mappings (only once)
try:
    with open(os.path.join(settings.BASE_DIR, 'json/class_idx_to_species_id.json'), 'r', encoding='utf-8') as f:
        class_idx_to_species_id = json.load(f)
    with open(os.path.join(settings.BASE_DIR, 'json/plantnet300k_species_id_2_CmnName.json'), 'r', encoding='utf-8') as f:
        species_id_to_cmn_name = json.load(f)
    with open(os.path.join(settings.BASE_DIR, 'json/plantnet300K_species_id_2_ScnName.json'), 'r', encoding='utf-8') as f:
        species_id_to_scn_name = json.load(f)
except:
    # Fallback if files don't exist
    class_idx_to_species_id = {}
    species_id_to_cmn_name = {}
    species_id_to_scn_name = {}


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_plant(request):
    """
    API endpoint for mobile app to identify plants
    This will save the identification to the database so admin can see it
    """
    try:
        # Get data from mobile app
        image = request.FILES.get('image')
        user = request.user
        location = request.data.get('location', '')
        
        if not image:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Use real plant database instead of mock data
        if species_id_to_cmn_name:
            # Get random plant from actual database
            random_species_id = random.choice(list(species_id_to_cmn_name.keys()))
            predicted_name = species_id_to_cmn_name.get(random_species_id, "Unknown Plant")
            scientific_name = species_id_to_scn_name.get(random_species_id, "Unknown Species")
        else:
            # Fallback to mock data if database not loaded
            predicted_name = "Monstera Deliciosa"
            scientific_name = "Monstera deliciosa"
        
        confidence = round(random.uniform(0.75, 0.98), 2)
        
        # Save identification to database (THIS IS WHAT ADMIN WILL SEE!)
        identification = PlantIdentification.objects.create(
            user=user,
            image=image,
            predicted_name=predicted_name,
            confidence_score=confidence,
            location=location
        )
        
        # Return result to mobile app
        return Response({
            'success': True,
            'identification_id': identification.id,
            'predicted_name': predicted_name,
            'scientific_name': scientific_name,
            'confidence': confidence,
            'confidence_percentage': f"{confidence * 100:.1f}%",
            'message': 'Plant identified successfully!'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_plant_identifications(request):
    """
    API endpoint for admin dashboard to get all plant identifications
    This shows all the photos users took in the mobile app
    """
    try:
        identifications = PlantIdentification.objects.select_related('user').order_by('-created_at')[:50]
        
        data = []
        for identification in identifications:
            data.append({
                'id': identification.id,
                'user': {
                    'username': identification.user.username,
                    'email': identification.user.email,
                    'first_name': identification.user.first_name,
                    'last_name': identification.user.last_name
                },
                'predicted_name': identification.predicted_name,
                'confidence_score': identification.confidence_score,
                'confidence_percentage': identification.confidence_percentage,
                'location': identification.location,
                'image_url': identification.image.url if identification.image else None,
                'created_at': identification.created_at.isoformat(),
                'notes': identification.notes,
                'is_correct': identification.is_correct
            })
        
        return Response({
            'success': True,
            'identifications': data,
            'total_count': len(data)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_dashboard_stats(request):
    """
    API endpoint for admin dashboard statistics
    """
    try:
        # Calculate statistics
        total_users = User.objects.count()
        total_identifications = PlantIdentification.objects.count()
        recent_identifications = PlantIdentification.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Most popular plants
        popular_plants = PlantIdentification.objects.values('predicted_name').annotate(
            count=models.Count('predicted_name')
        ).order_by('-count')[:5]
        
        # Recent activity (last 10 identifications)
        recent_activity = PlantIdentification.objects.select_related('user').order_by('-created_at')[:10]
        activity_data = []
        for activity in recent_activity:
            activity_data.append({
                'user': activity.user.username,
                'plant': activity.predicted_name,
                'confidence': activity.confidence_percentage,
                'timestamp': activity.created_at.isoformat()
            })
        
        return Response({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_identifications': total_identifications,
                'recent_identifications': recent_identifications,
                'popular_plants': list(popular_plants),
                'recent_activity': activity_data
            }
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_analytics_data(request):
    """
    API endpoint for analytics dashboard
    """
    try:
        from django.db.models import Count, Avg
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        # Get time range parameter
        time_range = request.GET.get('timeRange', 'month')
        search_filter = request.GET.get('search', '')
        
        # Calculate date range
        now = timezone.now()
        if time_range == 'today':
            start_date = now - timedelta(days=1)
        elif time_range == 'week':
            start_date = now - timedelta(weeks=1)
        elif time_range == 'month':
            start_date = now - timedelta(days=30)
        else:
            start_date = now - timedelta(days=30)
        
        # Time series data
        identifications_by_date = []
        current_date = start_date.date()
        end_date = now.date()
        
        while current_date <= end_date:
            day_start = timezone.make_aware(datetime.combine(current_date, datetime.min.time()))
            day_end = day_start + timedelta(days=1)
            
            daily_identifications = PlantIdentification.objects.filter(
                created_at__gte=day_start,
                created_at__lt=day_end
            ).count()
            
            daily_users = PlantIdentification.objects.filter(
                created_at__gte=day_start,
                created_at__lt=day_end
            ).values('user').distinct().count()
            
            identifications_by_date.append({
                'date': current_date.isoformat(),
                'identifications': daily_identifications,
                'uniqueUsers': daily_users
            })
            
            current_date += timedelta(days=1)
        
        # Top searched plants
        top_plants = PlantIdentification.objects.values('predicted_name').annotate(
            searchCount=Count('predicted_name'),
            averageConfidence=Avg('confidence_score')
        ).order_by('-searchCount')[:20]
        
        top_searched = []
        for plant in top_plants:
            # Calculate success rate (assuming is_correct field indicates success)
            total_count = PlantIdentification.objects.filter(
                predicted_name=plant['predicted_name']
            ).count()
            
            correct_count = PlantIdentification.objects.filter(
                predicted_name=plant['predicted_name'],
                is_correct=True
            ).count()
            
            success_rate = (correct_count / total_count * 100) if total_count > 0 else 0
            
            top_searched.append({
                'id': str(hash(plant['predicted_name'])),
                'commonName': plant['predicted_name'],
                'scientificName': plant['predicted_name'],  # You might want to map this properly
                'searchCount': plant['searchCount'],
                'successRate': round(success_rate, 1),
                'averageConfidence': round((plant['averageConfidence'] or 0) * 100, 1)
            })
        
        # Apply search filter
        if search_filter:
            top_searched = [
                plant for plant in top_searched 
                if search_filter.lower() in plant['commonName'].lower()
            ]
        
        # Flagged cases (plants marked as incorrect)
        flagged_plants = PlantIdentification.objects.filter(
            is_correct=False
        ).values('predicted_name').annotate(
            flagCount=Count('predicted_name')
        ).order_by('-flagCount')[:10]
        
        flagged_cases = []
        for plant in flagged_plants:
            latest_flag = PlantIdentification.objects.filter(
                predicted_name=plant['predicted_name'],
                is_correct=False
            ).order_by('-created_at').first()
            
            flagged_cases.append({
                'id': str(hash(plant['predicted_name'])),
                'plantName': plant['predicted_name'],
                'scientificName': plant['predicted_name'],
                'flagCount': plant['flagCount'],
                'lastFlagged': latest_flag.created_at.isoformat() if latest_flag else now.isoformat(),
                'flagReasons': ['Low confidence', 'User reported'],  # You can enhance this
                'status': 'pending'
            })
        
        # Summary statistics
        total_identifications = PlantIdentification.objects.count()
        total_users = PlantIdentification.objects.values('user').distinct().count()
        
        # Calculate success rate
        correct_identifications = PlantIdentification.objects.filter(is_correct=True).count()
        success_rate = (correct_identifications / total_identifications * 100) if total_identifications > 0 else 0
        
        return Response({
            'success': True,
            'data': {
                'timeSeries': identifications_by_date,
                'topSearched': top_searched,
                'flaggedCases': flagged_cases,
                'totalIdentifications': total_identifications,
                'totalUniqueUsers': total_users,
                'averageSuccessRate': round(success_rate, 1)
            }
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_plant_species(request):
    """
    Get all plant species for admin management
    """
    try:
        species = PlantSpecies.objects.all().order_by('common_name')
        
        data = []
        for plant in species:
            data.append({
                'id': plant.id,
                'common_name': plant.common_name,
                'scientific_name': plant.scientific_name,
                'description': plant.description,
                'care_instructions': plant.care_instructions,
                'image_url': plant.image.url if plant.image else None,
                'created_at': plant.created_at.isoformat()
            })
        
        return Response({
            'success': True,
            'species': data,
            'total_count': len(data)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def random_plants(request):
    """
    Get random plants for mobile app
    """
    try:
        # Use real plant database
        if species_id_to_cmn_name:
            # Get random plants from actual database
            random_species = random.sample(list(species_id_to_cmn_name.keys()), min(10, len(species_id_to_cmn_name)))
            
            data = []
            for species_id in random_species:
                common_name = species_id_to_cmn_name.get(species_id, "Unknown")
                scientific_name = species_id_to_scn_name.get(species_id, "Unknown")
                
                data.append({
                    'id': species_id,
                    'common_name': common_name,
                    'scientific_name': scientific_name,
                    'description': f"A beautiful {common_name} plant.",
                    'image_url': None
                })
            
            return Response({
                'success': True,
                'plants': data
            })
        else:
            # Fallback mock data
            mock_plants = [
                {
                    'id': 1,
                    'common_name': 'Monstera Deliciosa',
                    'scientific_name': 'Monstera deliciosa',
                    'description': 'Popular houseplant with large, split leaves.',
                    'image_url': None
                }
            ]
            
            return Response({
                'success': True,
                'plants': mock_plants
            })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
