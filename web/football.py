from django.http import JsonResponse
from django.shortcuts import render
from django.core.cache import cache
from datetime import datetime, timedelta
from web.models import Tournament
from .helpers import fetch_lineup, fetch_live_fixtures, fetch_match, fetch_match_fixtures, fetch_standings, fetch_tournaments_from_api, get_news, get_news_detail


SESSION_TIMEOUT = 60 * 60 * 24  # 24 hours

def home(request):
    ctx = {}
    return render(request, 'home.html', ctx)

def fetch_leagues(request):
    tournaments = fetch_tournaments_from_api()
    data = {
        "data": tournaments['response']
    }
    return JsonResponse(data)

def all_league(request):
    return render(request, 'leagues.html')


def fetch_fixtures(request, league_id, season):
    fixtures = fetch_match_fixtures(league_id, season)
    data = {
        "data": fixtures['response']
    }
    return JsonResponse(data)

def fetch_all_fixtures(request):
    fixtures = fetch_live_fixtures()
    data = {
        "data": fixtures['response']
    }
    return JsonResponse(data)

def all_fixtures(request, league_id, season):
    ctx = {
        "league_id": league_id,
        "season": season
    }
    return render(request, 'fixtures.html', ctx)

def match_detail(request, fixture_id, home, away):
    ctx = {
        "league_id": fixture_id,
        "home": home,
        "away": away
    }
    return render(request, 'match_detail.html', ctx)

def fetch_match_info(request):
    fixture = request.GET.get("id")
    fixtures = fetch_match(fixture)
    data = {
        "data": fixtures['response'][0]
    }
    return JsonResponse(data)


def fetch_match_h2h(request):
    home = request.GET.get("home")
    away = request.GET.get("away")
    h2h = fetch_lineup(home, away)
    data = {
        "data": h2h['response']
    }
    return JsonResponse(data)


def fetch_match_standings(request):
    league = request.GET.get("league")
    season = request.GET.get("season")
    standings = fetch_standings(league, season)
    data = {
        "data": standings['response']
    }
    return JsonResponse(data)

def news(request):
    news = get_news()
    ctx = {
        "news": news
    }
    return render(request, 'news.html', ctx)

def read_news(request, news_id):
    news = get_news_detail(news_id)
    ctx = {
        "news": news
    }
    return render(request, 'read_news.html', ctx)

def contact(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        # Handle form submission, e.g., send an email or save to database
        return JsonResponse({'status': True, 'message': 'Message sent successfully'})
    return render(request, 'contact.html')

def advertise(request):
    return render(request, 'advertise.html')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')
