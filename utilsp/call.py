import requests, json

class Sports:
    API_KEY = "9a4a6721cee8ca8185fdc8992c7c8e06a9af9630a3b1d7a06b874042083105f6"  # Replace with your actual API key
    BASE_URL = "https://apiv2.allsportsapi.com/football"

    @staticmethod
    def all_leagues():
        url = f"{Sports.BASE_URL}/?met=Leagues&APIkey={Sports.API_KEY}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Unable to fetch leagues data"}
        
    
    @staticmethod
    def get_fixtures():
        url = f"{Sports.BASE_URL}/?met=Leagues&APIkey={Sports.API_KEY}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Unable to fetch leagues data"}
    
    @staticmethod
    def get_fixture_by_league(league_id, fro, to):
        url = f"{Sports.BASE_URL}/?met=Fixtures&APIkey={Sports.API_KEY}&leagueId={league_id}&from={fro}&to={to}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Unable to fetch leagues data"}
    
    @staticmethod
    def get_match_detail(match_id):
        url = f"{Sports.BASE_URL}/?met=Fixtures&APIkey={Sports.API_KEY}&matchId={match_id}&withPlayerStats=1"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Unable to fetch leagues data"}
    
    @staticmethod
    def livescores():
        url = f"{Sports.BASE_URL}/?met=Livescore&APIkey={Sports.API_KEY}"
        response = requests.get(url)
        print(response.json())
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Unable to fetch leagues data"}