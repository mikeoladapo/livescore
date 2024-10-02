from django.conf import settings
import requests, json
from datetime import date
current_date = date.today()



API_KEY = settings.API_FOOTBALL_KEY
HEADERS = {'x-apisports-key': API_KEY}
BASE_URL = 'https://v3.football.api-sports.io'
# BASE_URL = 'https://v3.football.api-sports.com/'

def fetch_live_scores():
    url = f"{BASE_URL}/fixtures"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }

    x = requests.get(url, headers=headers)
    params = {
        "live":"all"
    }
    x = requests.get(url, headers=headers, params=params)
    return x.json()


def fetch_all_league():
    url = f"{BASE_URL}/leagues"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }

    x = requests.get(url, headers=headers)
    return x.json()


def fetch_league_round(league_id, year):
    url = f"{BASE_URL}/fixtures/rounds"
    params = {
        'season': year,
	    'league': league_id
    }
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }

    x = requests.get(url, headers=headers)
    return x.json()

def fetch_matches_by_league():
    url = f"{BASE_URL}/fixtures"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }
    x = requests.get(url, headers=headers)
    return x.json()

def fetch_matches_by_league_season(league, season):
    url = f"{BASE_URL}/fixtures"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }
    params = {
        "league": league,
        'season': season
    }
    x = requests.get(url, headers=headers, params=params)
    return x.json()

def fetch_match_info(match):
    url = f"{BASE_URL}/fixtures"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }

    x = requests.get(url, headers=headers)
    return x.json()

def fetch_api_data(endpoint, params):
    url = f"{BASE_URL}{endpoint}"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers, params=params)
    print(response.json())
    return response.json()

def get_game_stats(fixture_id):
    url = f'https://v3.football.api-sports.io/fixtures'
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }
    params = {
        'id': fixture_id,
        'timezone': 'Europe/London'
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

def fetch_head_to_head(team_home_id, team_away_id):
    url = f"https://v3.football.api-sports.io/fixtures/headtohead"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }
    params = {
        'h2h': f'{team_home_id}-{team_away_id}'
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

def fetch_match_date(date):
    url = f"https://v3.football.api-sports.io/fixtures?date={date}&timezone=Europe/London"
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY
    }

    response = requests.get(url, headers=headers)
    return response.json()


def fetch_info(fixture_id):
    url = f'{BASE_URL}/fixtures?id={fixture_id}'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_predictions(fixture_id):
    url = f'{BASE_URL}/predictions?fixture={fixture_id}'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_lineups(match_id):
    url = f'{BASE_URL}/matches/v2/get-lineups'
    headers = {
        "x-rapidapi-key": settings.API_FOOTBALL_KEY,
	    "x-rapidapi-host": "livescore6.p.rapidapi.com"
    }
    params = {
        "Category":"soccer",
        "Eid": match_id
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def fetch_events(fixture_id):
    url = f'{BASE_URL}/fixtures/events?fixture={fixture_id}'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_statistics(fixture_id):
    url = f'{BASE_URL}/fixtures/statistics?fixture={fixture_id}'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_h2h(fixture_id):
    url = f'{BASE_URL}/fixtures/headtohead?h2h={fixture_id}'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_leagues():
    url = f'{BASE_URL}/leagues'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def fetch_league(id):
    url = f'{BASE_URL}/leagues?id={id}'
    params = {
        "id": id
    }
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-apisports-key": API_KEY   
    }
    
    response = requests.get(url, headers=HEADERS)
    return response.json()

def top_scorers(id, season):
    season = current_date.year
    url = f'{BASE_URL}/players/topscorers?season={season}&id={id}'
    params = {
        'id': id,
        'season': season
    }
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-apisports-key": API_KEY   
    }
    response = requests.get(url, headers=HEADERS)
    return response.json()   
namez = {'type': top_scorers(140, 2022)}
name = namez['type']
    

def fetch_teams():
    url = "{BASE_URL}/teams"
    headers = {
        "x-apisports-key": API_KEY
    }

    response = requests.get(url, headers=headers)
    return response.json()



