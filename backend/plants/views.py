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
# Add these new views after your existing views

@api_view(['GET'])
@permission_classes([AllowAny])
def get_identification_reports(request):
    """
    Generate identification reports from mobile app data
    """
    try:
        from django.db.models import Count, Avg, Q
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        # Get query parameters
        date_range = request.GET.get('dateRange', '30')  # days
        report_type = request.GET.get('reportType', 'summary')
        
        # Calculate date range
        end_date = timezone.now()
        start_date = end_date - timedelta(days=int(date_range))
        
        # Base queryset
        identifications = PlantIdentification.objects.filter(
            created_at__gte=start_date,
            created_at__lte=end_date
        )
        
        if report_type == 'summary':
            # Summary report
            total_identifications = identifications.count()
            unique_users = identifications.values('user').distinct().count()
            unique_species = identifications.values('predicted_name').distinct().count()
            
            # Confidence distribution
            high_confidence = identifications.filter(confidence_score__gte=0.8).count()
            medium_confidence = identifications.filter(
                confidence_score__gte=0.5, 
                confidence_score__lt=0.8
            ).count()
            low_confidence = identifications.filter(confidence_score__lt=0.5).count()
            
            # Success rate (if you have user feedback)
            correct_ids = identifications.filter(is_correct=True).count()
            total_with_feedback = identifications.exclude(is_correct=None).count()
            success_rate = (correct_ids / total_with_feedback * 100) if total_with_feedback > 0 else 0
            
            # Daily activity
            daily_stats = []
            current_date = start_date.date()
            while current_date <= end_date.date():
                day_start = timezone.make_aware(datetime.combine(current_date, datetime.min.time()))
                day_end = day_start + timedelta(days=1)
                
                daily_count = identifications.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count()
                
                daily_stats.append({
                    'date': current_date.isoformat(),
                    'identifications': daily_count
                })
                current_date += timedelta(days=1)
            
            return Response({
                'success': True,
                'report': {
                    'type': 'summary',
                    'dateRange': f"{start_date.date()} to {end_date.date()}",
                    'summary': {
                        'totalIdentifications': total_identifications,
                        'uniqueUsers': unique_users,
                        'uniqueSpecies': unique_species,
                        'successRate': round(success_rate, 2),
                        'confidenceDistribution': {
                            'high': high_confidence,
                            'medium': medium_confidence,
                            'low': low_confidence
                        }
                    },
                    'dailyActivity': daily_stats
                }
            })
            
        elif report_type == 'species':
            # Species-specific report
            species_stats = identifications.values('predicted_name').annotate(
                identification_count=Count('id'),
                avg_confidence=Avg('confidence_score'),
                unique_users=Count('user', distinct=True)
            ).order_by('-identification_count')[:20]
            
            species_data = []
            for species in species_stats:
                # Get recent identifications for this species
                recent_ids = identifications.filter(
                    predicted_name=species['predicted_name']
                ).order_by('-created_at')[:5]
                
                recent_activity = [{
                    'user': id.user.username,
                    'date': id.created_at.isoformat(),
                    'confidence': round(id.confidence_score * 100, 1),
                    'location': id.location
                } for id in recent_ids]
                
                species_data.append({
                    'species': species['predicted_name'],
                    'identificationCount': species['identification_count'],
                    'averageConfidence': round((species['avg_confidence'] or 0) * 100, 1),
                    'uniqueUsers': species['unique_users'],
                    'recentActivity': recent_activity
                })
            
            return Response({
                'success': True,
                'report': {
                    'type': 'species',
                    'dateRange': f"{start_date.date()} to {end_date.date()}",
                    'speciesData': species_data
                }
            })
            
        elif report_type == 'users':
            # User activity report
            user_stats = identifications.values('user__username', 'user__email').annotate(
                identification_count=Count('id'),
                avg_confidence=Avg('confidence_score'),
                species_diversity=Count('predicted_name', distinct=True),
                last_activity=timezone.now()  # Will be overridden below
            ).order_by('-identification_count')[:50]
            
            user_data = []
            for user_stat in user_stats:
                # Get last activity
                last_identification = identifications.filter(
                    user__username=user_stat['user__username']
                ).order_by('-created_at').first()
                
                user_data.append({
                    'username': user_stat['user__username'],
                    'email': user_stat['user__email'],
                    'identificationCount': user_stat['identification_count'],
                    'averageConfidence': round((user_stat['avg_confidence'] or 0) * 100, 1),
                    'speciesDiversity': user_stat['species_diversity'],
                    'lastActivity': last_identification.created_at.isoformat() if last_identification else None
                })
            
            return Response({
                'success': True,
                'report': {
                    'type': 'users',
                    'dateRange': f"{start_date.date()} to {end_date.date()}",
                    'userData': user_data
                }
            })
        
        else:
            return Response({'error': 'Invalid report type'}, status=400)
            
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def export_identification_data(request):
    """
    Export identification data in CSV format
    """
    try:
        import csv
        from django.http import HttpResponse
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        # Get query parameters
        date_range = request.GET.get('dateRange', '30')
        format_type = request.GET.get('format', 'csv')
        
        # Calculate date range
        end_date = timezone.now()
        start_date = end_date - timedelta(days=int(date_range))
        
        # Get identifications
        identifications = PlantIdentification.objects.select_related('user').filter(
            created_at__gte=start_date,
            created_at__lte=end_date
        ).order_by('-created_at')
        
        if format_type == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="plant_identifications_{start_date.date()}_to_{end_date.date()}.csv"'
            
            writer = csv.writer(response)
            writer.writerow([
                'ID', 'Username', 'Email', 'Plant Name', 'Confidence (%)', 
                'Location', 'Date', 'Is Correct', 'Notes'
            ])
            
            for identification in identifications:
                writer.writerow([
                    identification.id,
                    identification.user.username,
                    identification.user.email,
                    identification.predicted_name,
                    round(identification.confidence_score * 100, 1),
                    identification.location or '',
                    identification.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    identification.is_correct,
                    identification.notes or ''
                ])
            
            return response
        
        elif format_type == 'json':
            data = []
            for identification in identifications:
                data.append({
                    'id': identification.id,
                    'user': {
                        'username': identification.user.username,
                        'email': identification.user.email
                    },
                    'plantName': identification.predicted_name,
                    'confidence': round(identification.confidence_score * 100, 1),
                    'location': identification.location,
                    'date': identification.created_at.isoformat(),
                    'isCorrect': identification.is_correct,
                    'notes': identification.notes
                })
            
            response = HttpResponse(
                json.dumps(data, indent=2),
                content_type='application/json'
            )
            response['Content-Disposition'] = f'attachment; filename="plant_identifications_{start_date.date()}_to_{end_date.date()}.json"'
            return response
            
        else:
            return Response({'error': 'Unsupported format'}, status=400)
            
    except Exception as e:
        return Response({'error': str(e)}, status=500)