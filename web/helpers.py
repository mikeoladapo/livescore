from django.conf import settings
import requests, json

from .models import Country, Tournament


API_URL = "https://v3.football.api-sports.io"
API_KEY = settings.API_FOOTBALL_KEY


def fetch_tournaments_from_api():
    url = f"{API_URL}/leagues"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data


def fetch_match_fixtures(league_id, season):
    url = f"{API_URL}/fixtures?league={league_id}&season={season}"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def fetch_live_fixtures():
    url = f"{API_URL}/fixtures?live=all"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def fetch_match(league):
    url = f"{API_URL}/fixtures?id={league}"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data


def fetch_lineup(home, away):
    url = f"{API_URL}/fixtures/headtohead?h2h={home}-{away}"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def fetch_standings(league, season):
    url = f"{API_URL}/standings?league={league}&season={season}"
    headers = {
        'x-apisports-key': API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

# News

def get_news():
    url = f"https://livescore6.p.rapidapi.com/news/v2/list"
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-rapidapi-key": "4ddd549c5emsh36299306752d386p100e29jsn5a0b48beb754"
    }
    x = requests.get(url, headers=headers)
    return x.json()


def get_news_detail(news_id):
    url = f"https://livescore6.p.rapidapi.com/news/v2/detail?id={news_id}"
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-rapidapi-key": "4ddd549c5emsh36299306752d386p100e29jsn5a0b48beb754"
    }
    x = requests.get(url, headers=headers)
    return x.json()