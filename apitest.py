#D.I.E
from scores import settings
import requests, json
from datetime import datetime
current_datetime = datetime.now()
c_datetime = current_datetime.strftime('%Y-%m-%d')



API_KEY = '1dc5012ddaeac7467353a6ba5f99736d'
HEADERS = {'x-apisports-key': API_KEY}
BASE_URL = 'https://v3.football.api-sports.io'



def fetch_league():
    url = f'{BASE_URL}/leagues?id=357&season=2024'
    headers = {
        "x-apisports-key": API_KEY,
    }
    response = requests.get(url, headers=HEADERS)
    
    league_data = response.json()
    #league_name = league_data['response'][0]['league']['name']
    
    print(league_data)  
    return response.json()
  

def top_scorers(season, id):
    url = f'{BASE_URL}/players/topscorers?season={season}&league={id}'
    params = {
        'season': season,
        'id': id   
    }
    headers = {
        "x-rapidapi-host": "livescore6.p.rapidapi.com",
        "x-apisports-key": API_KEY   
    }
    response = requests.get(url, headers=HEADERS)
    data = response.json()
    #player_name1 = data['response'][0]['player']['name']
    #player1_goals = data['response'][0]['statistics'][0]['goals']['total']
    #player1_club = data['response'][0]['statistics'][0]['team']['name']
    #player_name2 = data['response'][1]['player']['name']
    #player2_goals = data['response'][1]['statistics'][0]['goals']['total']
    #player_name3 = data['response'][2]['player']['name']
    #player_name4 = data['response'][3]['player']['name']
    #player_name5 = data['response'][4]['player']['name']
    #player_name6 = data['response'][5]['player']['name'] , player_name2, player2_goals, player_name3, player_name4, player_name5, player_name6
    
    print(data)
    return response.json()
    

        

def fetch_league2():
    url = f'{BASE_URL}/fixtures?league=5&season=2024&next=2'
    headers = {
        "x-apisports-key": API_KEY,
    }
    response = requests.get(url, headers=HEADERS)
    
    fixtures = response.json()
    fixture_date = fixtures['response'][0]['fixture']['date']
    venue = fixtures['response'][0]['fixture']['venue']['name'] 
    city = fixtures['response'][0]['fixture']['venue']['city'] 
    status = fixtures['response'][0]['fixture']['status']['long'] 
    home_team = fixtures['response'][0]['teams']['home']['name']
    home_teamlogo = fixtures['response'][0]['teams']['home']['logo'] 
    away_team = fixtures['response'][0]['teams']['away']['name']
    away_teamlogo = fixtures['response'][0]['teams']['home']['logo'] 
    
    fixture_date2 = fixtures['response'][1]['fixture']['date']
    venue2 = fixtures['response'][1]['fixture']['venue']['name'] 
    #print(fixture_date, venue, city, status, home_team, home_teamlogo, away_team, away_teamlogo)  
    print(f'{fixture_date}, {venue}, {home_team}, {home_teamlogo}, {away_team}')
    return response.json()
        
def fetch_league_standings():
    url = f'{BASE_URL}/standings?league=39&season=2020'
    headers = {
        "x-apisports-key": API_KEY,
    }
    response1 = requests.get(url, headers=HEADERS)
    table = []
    data = response1.json()
    standings = data['response'][0]['league']['standings'][0]
    for team_data in standings:
        team_info = team_data['team']
        table.append({
            'name': team_info['name'],
            'ranking': team_data['rank'],
            'pts': team_data['points'],
            'GD': team_data['goalsDiff'],
            'PLD': team_data['all']['played'],
            'Wins': team_data['all']['win'],
            'Draw': team_data['all']['draw'],
            'Lose': team_data['all']['lose']
        })
    
    print(table)




def get_live_matches():
    url = f"{BASE_URL}/fixtures?date={c_datetime}"
    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    print(data)
    
    if response.status_code == 200:
        print(data)
        return response.json()
        

#fetch_league()
#fetch_league_standings()
top_scorers(2020, 5)
#get_live_matches()

def get_recent():
    url = f"{BASE_URL}/fixtures?status=FT&date={c_datetime}"
    headers = {
        'x-apisports-key': settings.API_FOOTBALL_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    print(data)
    
#get_recent()