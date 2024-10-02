// static/js/scripts.js
$(document).ready(function() {
  $.ajax({
    url: "/m/dummy-data/",
    method: "GET",
    success: function (res) {
      data = res.data;
      var scoresDiv = $("#scores");
      data.forEach(function (match) {
        var matchDiv = $(
          '<a href="/m/match/' +
            match.id +
            '/" class="list-group-item list-group-item-action flex-column align-items-start bg-dark text-white mb-3"></a>'
        );
        var team1Div = $(
          '<div class="d-flex justify-content-between align-items-center"></div>'
        );
        var team2Div = $(
          '<div class="d-flex justify-content-between align-items-center"></div>'
        );
        var statusOrTimeDiv = $(
          '<div class="text-end my-2 status-match"></div>'
        );

        var team1LogoDiv = $(
          '<div class="team-logo"><img src="' +
            match.logo_team1 +
            '" alt="' +
            match.team1 +
            ' logo" class="img-fluid"><span>' +
            match.team1 +
            "</span></div>"
        );
        var team2LogoDiv = $(
          '<div class="team-logo"><img src="' +
            match.logo_team2 +
            '" alt="' +
            match.team2 +
            ' logo" class="img-fluid"><span>' +
            match.team2 +
            "</span></div>"
        );

        if (match.status === "FT" || match.status.includes("'")) {
          // Match has started or finished
          team1Div.append(
            "<span>" + "</span><span>" + match.score_team1 + "</span>"
          );
          team2Div.append(
            "<span>" + "</span><span>" + match.score_team2 + "</span>"
          );
          statusOrTimeDiv.text(match.status);
        } else {
          // Match has not started
          statusOrTimeDiv.text(new Date(match.match_date).toLocaleString());
        }

        team1Div.prepend(team1LogoDiv);
        team2Div.prepend(team2LogoDiv);

        matchDiv.append(team1Div);
        matchDiv.append(statusOrTimeDiv);
        matchDiv.append(team2Div);

        scoresDiv.append(matchDiv);
      });
    },
    error: function (error) {
      console.error("Error fetching data", error);
    },
  });

  // Fetch and display leagues
  $.ajax({
    url: "/m/dummy-data/",
    method: "GET",
    success: function (res) {
      data = res.leagues;
      var leaguesList = $("#leagues-list");
      data.forEach(function (league) {
        var leagueItem = $(
          '<li class="list-group-item bg-dark text-white d-flex align-items-center"></li>'
        );
        leagueItem.append(
          '<img src="' +
            league.logo +
            '" alt="' +
            league.name +
            ' logo" class="img-fluid" style="width: 30px; height: 30px; margin-right: 10px;">'
        );
        leagueItem.append(
          "<span>" + league.name + " (" + league.country + ")</span>"
        );
        leaguesList.append(leagueItem);
      });
    },
    error: function (error) {
      console.error("Error fetching data", error);
    },
  });
});
