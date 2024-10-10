from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_protect
import requests
from django.contrib.auth.decorators import login_required 
from django.contrib import messages
from web.models import Article
from datetime import datetime
current_datetime = datetime.now()
current_year = current_datetime.year

# Custom built render
from core.shortcuts import render

import pytz
from django.utils.dateparse import parse_date

BASE_URL = 'https://v3.football.api-sports.io'



@csrf_protect
def login_view(request):
    if request.method  == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(request.POST, username, password)
        user = authenticate(username=username, password=password)  

        if user:
            login(request, user)
            return redirect('pc_index')
        else:
            context = {'message': None} 

            if not username:
                context['message'] = "Please enter your username."
            elif not password:
                context['message'] = "Please enter your password."
            else:
                context['message'] = "Invalid username or password."

            return render(request, 'login.html', context)
    return render(request, 'login.html')


@login_required       
def logout_view(request):
    logout(request)
    return redirect ('login')


def get_news(request):
    context = {
        'news':Article.objects.all() 
    }
    return render(request,'news.html',context)


@login_required         
def get_live_matches(request):
    url = f"{BASE_URL}/fixtures?live=all"
    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    if response.status_code == 200:
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Unable to fetch live matches'}, status=response.status_code)


@login_required 
def get_live_matches2(request):
    url = f"{BASE_URL}/fixtures?live=all"
    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        matches = format_matches(data['response'])
        return JsonResponse({'matches': matches}, safe=False)
    return JsonResponse({'error': 'Unable to fetch live matches'}, status=response.status_code)


@login_required 
def get_recent_updates(request):
    date_str = request.GET.get('date', None)
    if date_str:
        try:
            date = parse_date(date_str)
            if not date:  
                raise ValueError
        except ValueError:
            return JsonResponse({'error': 'Invalid date format'}, status=400)
    else:
        date = datetime.today().date()

    if date > datetime.today().date():
        # If the date is in the future, do not include the status parameter
        url = f"{BASE_URL}/fixtures?date={date.strftime('%Y-%m-%d')}"
    else:
        # If the date is in the past or today, include the status parameter
        url = f"{BASE_URL}/fixtures?status=FT&date={date.strftime('%Y-%m-%d')}"

    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        matches = format_matches(data['response'])
        return JsonResponse({'matches': matches}, safe=False)
    return JsonResponse({'error': 'Unable to fetch recent updates'}, status=response.status_code)


def format_matches(matches):
    league_ids = [1, 2, 39, 140, 135, 78, 61]              #World cup, Uefa champions league, Premier League, LaLiga, Serie A, Bundesliga, Ligue1 
    prioritized_matches = []
    other_matches = []
    ordered_matches = []
        
    for match in matches:
        league_id = match['league']['id']  #league id is in this key
        if league_id in league_ids:
            # Combine the prioritized matches first, followed by the other matches
            prioritized_matches.append({
            'id': match['fixture']['id'],
            'leagueName': match['league']['name'],
            'leagueLogo': match['league']['logo'],
            'leagueId': match['league']['id'],
            'group': match['league']['round'],
            'team1Name': match['teams']['home']['name'],
            'team1Logo': match['teams']['home']['logo'],
            'team1Score': match['goals']['home'],
            'team2Name': match['teams']['away']['name'],
            'team2Logo': match['teams']['away']['logo'],
            'team2Score': match['goals']['away'],
            'match_date_time': match['fixture']['timestamp'],
            'match_status': match['fixture']['status'],
            'elapsed': match['fixture']['status']['elapsed'],  # Time elapsed
            })
        else:
            other_matches.append({
            'id': match['fixture']['id'],
            'leagueName': match['league']['name'],
            'leagueLogo': match['league']['logo'],
            'leagueId': match['league']['id'],
            'group': match['league']['round'],
            'team1Name': match['teams']['home']['name'],
            'team1Logo': match['teams']['home']['logo'],
            'team1Score': match['goals']['home'],
            'team2Name': match['teams']['away']['name'],
            'team2Logo': match['teams']['away']['logo'],
            'team2Score': match['goals']['away'],
            'match_date_time': match['fixture']['timestamp'],
            'match_status': match['fixture']['status'],
            'elapsed': match['fixture']['status']['elapsed'],  # Time elapsed
            })
        ordered_matches = prioritized_matches + other_matches    
    return ordered_matches


@login_required 
def index(request):
    context = {
        'is_home': True,
    }
    return render(request, "index.html", context)


# Matches
@login_required 
def LiveMatches(request):
    context = {
        'is_home': False,
    }
    return render(request, "live-match.html", context)


@login_required 
def SingleMatch(request, match_id):
    match_url = f"{BASE_URL}/fixtures?id={match_id}"
    stats_url = f"{BASE_URL}/fixtures/statistics?fixture={match_id}"
    lineup_url = f"{BASE_URL}/fixtures/lineups?fixture={match_id}"
    
    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    
    match_response = requests.get(match_url, headers=headers)
    stats_response = requests.get(stats_url, headers=headers)
    lineup_response = requests.get(lineup_url, headers=headers)
    
    
    if match_response.status_code == 200 and stats_response.status_code == 200 and lineup_response.status_code == 200:
        match_data = match_response.json()
        stats_data = stats_response.json()
        lineup_data = lineup_response.json()
        
        match = match_data['response'][0]
        home_team_id = match['teams']['home']['id']
        away_team_id = match['teams']['away']['id']
        h2h_url = f"{BASE_URL}/fixtures/headtohead?h2h={home_team_id}-{away_team_id}"
        
        h2h_response = requests.get(h2h_url, headers=headers)
        
        if h2h_response.status_code == 200:
            h2h_data = h2h_response.json()
            match_info = format_match_info(match, stats_data['response'], h2h_data['response'], lineup_data['response'])
            return render(request, 'match_detail.html', {'match_info': match_info, 'is_home': False})
    return HttpResponse(status=404)


@login_required 
def format_match_info(match, statistics, h2h, lineups):
    # Check if statistics are available
    if statistics and len(statistics) >= 2:
        home_team_stats = statistics[0]['statistics']
        away_team_stats = statistics[1]['statistics']
        
        formatted_stats = []
        for i in range(len(home_team_stats)):
            home_stat = 0 if home_team_stats[i]['value'] is None else home_team_stats[i]['value']
            away_stat = 0 if away_team_stats[i]['value'] is None else away_team_stats[i]['value']
            stat_type = home_team_stats[i]['type']
            
            home_stat_val = int(home_stat[:-1]) if isinstance(home_stat, str) and home_stat.endswith('%') else home_stat
            away_stat_val = int(away_stat[:-1]) if isinstance(away_stat, str) and away_stat.endswith('%') else away_stat

            formatted_stats.append({
                'type': stat_type,
                'home': home_stat,
                'away': away_stat,
                'home_percentage': calculate_percentage(home_stat_val, away_stat_val),
                'away_percentage': calculate_percentage(away_stat_val, home_stat_val),
            })
    else:
        formatted_stats = []

    # Extract H2H data
    h2h_stats = calculate_h2h_stats(h2h, match['teams']['home']['id'], match['teams']['away']['id'])

    date_time = datetime.fromtimestamp(match['fixture']['timestamp'], pytz.utc)

    return {
        'id': match['fixture']['id'],
        'date': date_time.strftime('%d %b, %Y'),
        'time': date_time.strftime('%H:%M'),
        'referee': match['fixture']['referee'],
        'venue': f"{match['fixture']['venue']['name']}, {match['fixture']['venue']['city']}",
        'events': match.get('events', []),
        'statistics': formatted_stats,
        'fulltime': match['goals'],
        'league': match['league']['name'],
        'league_logo': match['league']['logo'],
        'league_country': match['league']['country'],
        'home_team': {
            'name': match['teams']['home']['name'],
            'logo': match['teams']['home']['logo'],
        },
        'away_team': {
            'name': match['teams']['away']['name'],
            'logo': match['teams']['away']['logo'],
        },
        'h2h_stats': h2h_stats,
        'lineups': format_lineups(lineups, match.get('events', []))
    }


@login_required 
def calculate_h2h_stats(h2h, home_team_id, away_team_id):
    total_matches = len(h2h)
    home_wins = sum(1 for match in h2h if match['teams']['home']['id'] == home_team_id and match['teams']['home']['winner'])
    away_wins = sum(1 for match in h2h if match['teams']['away']['id'] == away_team_id and match['teams']['away']['winner'])
    draws = total_matches - home_wins - away_wins

    return {
        'all_time': {
            'total': total_matches,
            'home_wins': home_wins,
            'away_wins': away_wins,
            'draws': draws
        },
        'last_five': {
            'total': min(5, total_matches),
            'home_wins': home_wins,
            'away_wins': away_wins,
            'draws': draws
        }
    }
    
    
@login_required 
def format_lineups(lineups, events):
    if not lineups:
        return {'home': None, 'away': None}

    home_team_lineup = lineups[0]
    away_team_lineup = lineups[1]

    substitutions = [event for event in events if event['type'] == 'subst']

    return {
        'home': {
            'team': home_team_lineup['team'],
            'formation': home_team_lineup['formation'],
            'startXI': home_team_lineup['startXI'],
            'substitutes': home_team_lineup['substitutes'],
            'coach': home_team_lineup['coach'],
        },
        'away': {
            'team': away_team_lineup['team'],
            'formation': away_team_lineup['formation'],
            'startXI': away_team_lineup['startXI'],
            'substitutes': away_team_lineup['substitutes'],
            'coach': away_team_lineup['coach'],
        },
        'substitutions': substitutions
    }


@login_required 
def calculate_percentage(value1, value2):
    if value1 is not None:
        value1 = float(value1) if isinstance(value1, str) else value1
    else:
        value1 = 0
    if value2 is not None:
        value2 = float(value2) if isinstance(value2, str) else value2
    else:
        value2 = 0
    total = value1 + value2
    if total == 0:
        return 50  # Default percentage if both values are zero
    return (value1 / total) * 100
    
    
@login_required 
def LeagueInfo(request, league_id):
    
    top_scorers_url = f'{BASE_URL}/players/topscorers?season=2020&league={league_id}'                #Top scorers
    Ffixtures_url = f'{BASE_URL}/fixtures?league={league_id}&season={current_year}&next=3'                  #Future 3 matches
    Pfixtures_url = f'{BASE_URL}/fixtures?league={league_id}&season={current_year}&last=2'                  #Past 2 matches
    standings_url = f'{BASE_URL}/standings?league={league_id}&season={current_year}'                 #League standings
    
    params = {
        'id': league_id   
    }
    
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-apisports-key": settings.API_FOOTBALL_KEY   
    }

    response1 = requests.get(top_scorers_url, headers=headers)              #topscorers info response
    response2 = requests.get(Ffixtures_url, headers=headers)                 #future fixtures info response
    response3 = requests.get(standings_url, headers=headers)                #league standings info response
    response4 = requests.get(Pfixtures_url, headers=headers)                #Past fixtures info response
    
    context = {'is_home': False, 'current_datetime': current_datetime}
    
    if response1.status_code == 200 and response2.status_code == 200 and response3.status_code  == 200 and response4.status_code  == 200:         #if all responses are OK
        try:
            data = response1.json()
            if 'response' in data and len(data['response']) > 0:
                #PARSED TOPSCORERS DATA
                player_name1 = data['response'][0]['player']['name']
                player_name2 = data['response'][1]['player']['name']
                player_name3 = data['response'][2]['player']['name']
                player_name4 = data['response'][3]['player']['name']
                player_name5 = data['response'][4]['player']['name']
                player_name6 = data['response'][5]['player']['name']
                
                player1_goals = data['response'][0]['statistics'][0]['goals']['total']
                player2_goals = data['response'][1]['statistics'][0]['goals']['total']
                player3_goals = data['response'][3]['statistics'][0]['goals']['total']
                player4_goals = data['response'][4]['statistics'][0]['goals']['total']
                player5_goals = data['response'][5]['statistics'][0]['goals']['total']
                player6_goals = data['response'][6]['statistics'][0]['goals']['total']
                
                player1_club = data['response'][0]['statistics'][0]['team']['name']
                player2_club = data['response'][1]['statistics'][0]['team']['name']
                player3_club = data['response'][2]['statistics'][0]['team']['name']
                player4_club = data['response'][3]['statistics'][0]['team']['name']
                player5_club = data['response'][4]['statistics'][0]['team']['name']
                player6_club = data['response'][5]['statistics'][0]['team']['name']
                
                player1_club_logo = data['response'][0]['statistics'][0]['team']['logo']
                player2_club_logo = data['response'][1]['statistics'][0]['team']['logo']
                player3_club_logo = data['response'][2]['statistics'][0]['team']['logo']
                player4_club_logo = data['response'][3]['statistics'][0]['team']['logo']
                player5_club_logo = data['response'][4]['statistics'][0]['team']['logo']
                player6_club_logo = data['response'][5]['statistics'][0]['team']['logo']
                
                context.update({
                'player_name1': player_name1, 'player_name2': player_name2, 'player_name3': player_name3, 
                'player_name4': player_name4, 'player_name5': player_name5,'player_name6': player_name6, 
                
                'player1_goals': player1_goals, 'player2_goals': player2_goals, 'player3_goals': player3_goals, 
                'player4_goals': player4_goals, 'player5_goals': player5_goals, 'player6_goals': player6_goals, 
                
                'player1_club': player1_club, 'player2_club': player2_club, 'player3_club': player3_club,
                'player4_club': player4_club, 'player5_club': player5_club, 'player6_club': player6_club,
                
                'player1_club_logo': player1_club_logo, 'player2_club_logo': player2_club_logo, 'player3_club_logo': player3_club_logo,
                'player3_club_logo': player3_club_logo, 'player4_club_logo': player4_club_logo, 'player5_club_logo':player5_club_logo, 'player6_club_logo': player6_club_logo})
            else:
                pass
        except (KeyError, IndexError, ValueError) as e:
            pass
        
        try:
            data2 = response3.json()
            if 'response' in data2 and len(data2['response']) > 0:
                #PARSED LEAGUE STANDINGS DATA
                table = []
                standings = data2['response'][0]['league']['standings'][0]
                for team_data in standings:
                    team_info = team_data['team']
                    table.append({
                        'name': team_info['name'],
                        'ranking': team_data['rank'],
                        'pts': team_data['points'],
                        'GD': team_data['goalsDiff'],
                        'Played': team_data['all']['played'],
                        'Wins': team_data['all']['win'],
                        'Draw': team_data['all']['draw'],
                        'Lose': team_data['all']['lose'],
                        'GF': team_data['all']['goals']['for'],
                        'GA': team_data['all']['goals']['against'],
                        'team_logo': team_info['logo']
                    })
                    context.update({'table': table})
            else:
                pass
                
        except (KeyError, IndexError, ValueError) as e:
            pass
                    
            
                
        try:
            future_fixtures = response2.json()
            past_fixtures = response4.json()
            if 'response' in future_fixtures and len(future_fixtures['response']) > 0:
                #PARSED FIXTURE DATA
            
                #FUTURE FIXTURES
                league_name = future_fixtures['response'][1]['league']['name']
                league_logo = future_fixtures['response'][1]['league']['logo']
                #MATCH 1
                fixture_date = future_fixtures['response'][0]['fixture']['date']
                date_time_obj = datetime.fromisoformat(fixture_date)                            # Convert to datetime object
                date_time = date_time_obj.strftime("%B %d, %Y, %I:%M %p")                       # Format the datetime object to a more readable format             
                venue = future_fixtures['response'][0]['fixture']['venue']['name'] 
                home_team = future_fixtures['response'][0]['teams']['home']['name']
                home_team_logo = future_fixtures['response'][0]['teams']['home']['logo']
                away_team = future_fixtures['response'][0]['teams']['away']['name']
                away_team_logo = future_fixtures['response'][0]['teams']['away']['logo'] 
                
                #MATCH2
                fixture_date2 = future_fixtures['response'][1]['fixture']['date']  
                date_time_obj = datetime.fromisoformat(fixture_date2)                           # Convert to datetime object
                date_time2 = date_time_obj.strftime("%B %d, %Y, %I:%M %p")                      # Format the datetime object to a more readable format
                venue2 = future_fixtures['response'][1]['fixture']['venue']['name']  
                home_team2 = future_fixtures['response'][1]['teams']['home']['name']
                home_team2_logo = future_fixtures['response'][1]['teams']['home']['logo']
                away_team2 = future_fixtures['response'][1]['teams']['away']['name']
                away_team2_logo = future_fixtures['response'][1]['teams']['away']['logo']
                
                #MATCH3
                fixture_date3 = future_fixtures['response'][1]['fixture']['date']
                date_time_obj = datetime.fromisoformat(fixture_date3)                           # Convert to datetime object
                date_time3 = date_time_obj.strftime("%B %d, %Y, %I:%M %p")                      # Format the datetime object to a more readable format
                venue3 = future_fixtures['response'][2]['fixture']['venue']['name'] 
                home_team3 = future_fixtures['response'][2]['teams']['home']['name'] 
                home_team3_logo = future_fixtures['response'][2]['teams']['home']['logo']
                away_team3 = future_fixtures['response'][2]['teams']['away']['name'] 
                away_team3_logo = future_fixtures['response'][2]['teams']['away']['logo']
                
                
                #PAST FIXTURES
                
                #MATCH 1
                phome_team = past_fixtures['response'][0]['teams']['home']['name']
                phome_team_logo = past_fixtures['response'][0]['teams']['home']['logo']  
                paway_team = past_fixtures['response'][0]['teams']['away']['name']
                paway_team_logo = past_fixtures['response'][0]['teams']['away']['logo']  
                
                #MATCH2  
                phome_team2 = past_fixtures['response'][1]['teams']['home']['name']
                phome_team2_logo = past_fixtures['response'][1]['teams']['home']['logo']
                paway_team2 = past_fixtures['response'][1]['teams']['away']['name']
                paway_team2_logo = past_fixtures['response'][1]['teams']['away']['logo']

                    
                context.update({'league_name': league_name, 'league_logo': league_logo, 'fixture_date': date_time, 'fixture_date2': date_time2, 'fixture_date3': date_time3, 
                
                'venue': venue, 'home_team': home_team, 'home_team_logo': home_team_logo, 'away_team': away_team, 'away_team_logo': away_team_logo,
                
                
                'venue2': venue2, 'home_team2': home_team2, 'away_team2': away_team2, 'home_team2_logo': home_team2_logo, 'away_team2_logo': away_team2_logo,
                
                'venue3': venue3,  'home_team3': home_team3, 'away_team3': away_team3, 'home_team3_logo': home_team3_logo, 'away_team3_logo': away_team3_logo, 
                
                'phome_team': phome_team, 'paway_team': paway_team, 'phome_team_logo': phome_team_logo, 'paway_team_logo': paway_team_logo,
                
                'phome_team2': phome_team2, 'paway_team2': paway_team2, 'phome_team2_logo': phome_team2_logo, 'paway_team2_logo': paway_team2_logo})
            
            else:
                pass
        except (KeyError, IndexError, ValueError) as e:
            pass

        #Future fixtures
                           
        return render(request, "league.html", context)     
    
     
@login_required
def newsPage(request):
    news = {
        'homepageArticles': [
            {
                'articles': Article.objects.prefetch_related('mainMedia', 'category').all()
            }
        ]
    }
    context = {
        'news': news
    }
    return render(request, 'news.html', context)


@login_required
def newsDetailPage(request, slug):
    article = get_object_or_404(Article, slug=slug)
    
    context = {
        'news': {
            'article': article
        },
        'news_type': article.category.name if article.category else 'General' 
    }
    
    return render(request, 'news_detail.html', context)



# Settings
@login_required
def Settings(request):
    context = {
        'is_home': False,
    }
    return render(request, "settings.html", context)

@login_required 
def generalSettings(request):
    context = {
        'is_home': False,
    }
    return render(request, "general-settings.html", context)

@login_required 
def helpSettings(request):
    context = {
        'is_home': False,
    }
    return render(request, "help.html", context)

@login_required 
def TOsSettings(request):
    context = {
        'is_home': False,
    }
    return render(request, "tos.html", context)

@login_required 
def AdvertWithUs(request):
    context = {
        'is_home': False,
    }
    return render(request, "advertise.html", context)

@login_required 
def PrivacyPolicy(request):
    context = {
        'is_home': False,
    }
    return render(request, "privacy.html", context)