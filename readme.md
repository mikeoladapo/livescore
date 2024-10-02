# 720scores (LiveScore.com Clone)


Header Nab
SideNav (This display menu from the left side when clicked)
nav icon, Logo, icon - Scores, icon - Favourites, icon - News, Logo

- Scores
-- Football
-- Hockey
-- Basketball
-- Tennis
-- Cricket

- Favourites
-- Football
-- Hockey
-- Basketball
-- Tennis
-- Cricket

- News
-- Football
-- Predictions
-- Match Reports
-- Women's football


The background has an image

The main content in a box while the box is at the center.

<body> - full screen with image as bg, background can be clicked as a link
<main> -- background is black
<header>
<left> - size sample col-md-8
<right> - size sample col-md-4
<footer>
</main>
</body>

Let's have our livescore page

<left><center><right>


Left
We should have
- Region (an arrow at the right which is to show all regions)
-- Top 5 region with link

- Teams (an arrow at the right which is to show all teams)
-- Top 5 teams with link

-- Competitions (an arrow at the right which is to show all competitions)
-- Top 5 competitions with link

We will be using https://v3.football.api-sports.io/

<div class="center">
    <!-- Let's have nav for Live (Active), Previous Day (FRI 14 Jun), Next Day, Today, Monday, Tuesday, and a calendar icon-->
    <h2>Live Scores</h2>
    <div class="match">
        <div class="match-header">
            <span class="league">Brazil Serie A</span>
        </div>
        <div class="teams">
            <span class="team-name">Bragantino</span>
            <span class="team-score">2:1</span>
            <span class="team-name">Juventude</span>
        </div>
        <div class="match-status">
            <span>'29 - (1H)</span>
        </div>
    </div>
</div>


This format

indicator dot Team Logo Team Name                     Score
29' Team Logo Team Name                     Score


When we click on any match, we want to see full details of the match...

Nav link to navigate between::: Info, Predictions, Line Ups, Events, Statistics, H2H
Their API
Info (Date, Referee, Stadium)
Prediction
Line Ups (I want to have a stadium picture and the players with their names and number)
Events
Statistics (both teams)
https://v3.football.api-sports.io/fixtures
https://v3.football.api-sports.io/predictions
https://v3.football.api-sports.io/fixtures/lineups
https://v3.football.api-sports.io/fixtures/statistics
https://v3.football.api-sports.io/fixtures/events
https://v3.football.api-sports.io/fixtures/headtohead


<div class="line-ups">
    <div class="team-s">
        <div class="team-head">
            <h5>Team 1</h5>
            <span id="formation-A"></span>
        </div>
        <div class="player-sub">
            <div class="formation" id="formation-team1"></div>
            <h6>Substitutes</h6>
            <div class="substitutes" id="substitutes-team1"></div>
        </div>
    </div>
    <div class="team-s">
        <div class="team-head">
            <h5>Team 2</h5>
            <span id="formation-B"></span>
        </div>
        <div class="player-sub">
            <div class="formation" id="formation-team2"></div>
            <h6>Substitutes</h6>
            <div class="substitutes" id="substitutes-team2"></div>
        </div>
    </div>
</div>