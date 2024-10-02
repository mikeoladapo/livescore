$(".send_message").on("submit", function(e){
  e.preventDefault();
  const fd = $(this);

  $.ajax({
    type: "POST",
    url: window.location.href,
    data: fd.serialize(),
    dataType: "json",
    beforeSend: function () {
      $(".btn-send").text("Sending...");
      $(".btn-send").attr("disabled", "disabled");
      $(".msg-alert").removeClass("error");
      $(".msg-alert").removeClass("success");
      $(".msg-alert").hide();
    },
    complete: function () {
      $(".btn-send").text("Send");
      $(".btn-send").removeAttr("disabled");
    },
    success: function (res) {
      if (res) {
        $(".msg-alert").addClass("success");
        $(".msg-alert").show();
        $(".msg-alert").text(res.message);
        $(".send_message").trigger("reset");
      } else {
        $(".msg-alert").show();
        $(".msg-alert").addClass("error");
        $(".msg-alert").text(res.message);
      }
    },
    error: function () {
      $(".msg-alert").addClass("error");
      $(".msg-alert").show();
      $(".msg-alert").text("An error occurred. Try again later.");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const CACHE_KEY = "top_tournaments";
  const CACHE_EXPIRY_KEY = "top_tournaments_expiry";
  const CACHE_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  async function fetchAndRenderFixtures(league, season) {
    try {
      const response = await fetch(`/fetch-fixtures/${league}/${season}`);
      const data = await response.json();
      renderByFixtures(data);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  }

  function fetchTournaments() {
    showLoader();
    fetch("/fetch-leagues/")
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
        localStorage.setItem(CACHE_EXPIRY_KEY, Date.now() + CACHE_TIMEOUT);
        renderTournaments(data.data);
        // renderAllLeagues(data.data);
        hideLoader();
      });
  }

  function fetchFixtures(leagueId, seasonYear) {
    showLoader();
    fetch(`/fetch-fixtures/${leagueId}/${seasonYear}/`)
      .then((response) => response.json())
      .then((data) => {
        // renderFixtures(data.data);
        allFixtures = data.data; // Store the fetched fixtures
        renderFixtures(allFixtures); // Render all fixtures initially
        hideLoader();
      });
  }

  

  // Function to fetch initial fixtures on page load
  function fetchInitialFixtures() {
    showLoader();
    fetch(`/fetch-fixtures/`)
      .then((response) => response.json())
      .then((data) => {
        allFixtures = data.data; // Store the fetched fixtures
        renderFixtures(allFixtures); // Render all fixtures initially
        hideLoader();
      });
  }

  setInterval(fetchInitialFixtures, 60000);

  function renderPage(tournaments) {
    const pageElement = document.querySelector("[data-page]");
    const pageType = pageElement ? pageElement.getAttribute("data-page") : null;
    if (pageType === "home") {
      fetchInitialFixtures();
      renderTournaments(tournaments);
    } else if (pageType === "match") {
      const matchId = document
        .querySelector(".attrib")
        .getAttribute("data-match");
      const homeId = document
        .querySelector(".attrib")
        .getAttribute("data-home");
      const awayId = document
        .querySelector(".attrib")
        .getAttribute("data-away");
      getMatchInfo(matchId);
    } else if (pageType === "leagues") {
      renderAllLeagues(tournaments);
    }
  }

  function renderAllLeagues(leagues) {
    const list = document.getElementById("leagues-list");
    list.innerHTML = "";
    leagues.forEach((league) => {
      const listItem = document.createElement("div");
      listItem.className = "col-6 col-md-4 col-lg-3 mb-4";
      listItem.innerHTML = `
        <a href="/tournaments/${league.league.id}/${league.league.season}/fixtures/view/" class="shadow-sm league-card">
            <div class="card-body text-center">
                <div class="league-join">
                    <img src="${league.league.logo}" alt="${league.league.name} Flag" class="mb-2">
                    <h6 class="card-title">${league.league.name}</h6>
                </div>
                <p class="card-text">${league.country.name}</p>
            </div>
        </a>
    `;
      list.appendChild(listItem);
    });
  }

  function renderByFixtures(fixtures) {
    const fixturesContainer = document.getElementById("fixtures-container");
    fixturesContainer.innerHTML = "";

    fixtures.forEach((fixture) => {
      const fixtureItem = document.createElement("div");
      fixtureItem.className = "competition mt-4";
      fixtureItem.innerHTML = `
            <div class="competition-header">
                <img src="${fixture.league.logo}" alt="${fixture.league.name}">
                <span>${fixture.league.name}</span>
            </div>
            <div class="list-group">
                ${fixture.fixture
                  .map(
                    (match) => `
                    <a href="/matches/${
                      match.id
                    }/" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                        <div class="teams-and-score">
                            <div class="team">
                                <img src="${match.teams.home.logo}" alt="${
                      match.teams.home.name
                    }">
                                <span>${match.teams.home.name}</span>
                            </div>
                            <div class="score">
                                ${
                                  match.status === "Not Started"
                                    ? "vs"
                                    : `${match.goals.home} - ${match.goals.away}`
                                }
                            </div>
                            <div class="team">
                                <img src="${match.teams.away.logo}" alt="${
                      match.teams.away.name
                    }">
                                <span>${match.teams.away.name}</span>
                            </div>
                        </div>
                        <div class="match-info">
                            <div class="match-time">
                                ${
                                  match.status.short === "Not Started"
                                    ? new Date(
                                        match.fixture.date
                                      ).toLocaleString()
                                    : match.status.short
                                }
                            </div>
                            <button class="btn btn-favorite">★</button>
                        </div>
                    </a>
                `
                  )
                  .join("")}
            </div>
        `;
      fixturesContainer.appendChild(fixtureItem);
    });
  }

  function renderFixtures(fixtures) {
    const fixturesContainer = document.getElementById("fixtures-container");
    fixturesContainer.innerHTML = "";
    fixtures.forEach((fixtureData) => {
      const fixture = fixtureData.fixture;
      const league = fixtureData.league;
      const teams = fixtureData.teams;
      const goals = fixtureData.goals;
      const status = fixtureData.fixture.status;

      const fixtureItem = document.createElement("div");
      fixtureItem.className = "competition mt-4";
      fixtureItem.innerHTML = `
            <div class="competition-header">
                <img src="${league.logo}" alt="${league.name}">
                <span>${league.round}</span>
            </div>
            <div class="list-group">
                <a href="/match/${fixture.id}/view/${
        teams.home.id
      }/${
        teams.away.id
      }/" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <div class="teams-and-score">
                        <div class="team">
                            <img src="${teams.home.logo}" alt="${
        teams.home.name
      }">
                            <span>${teams.home.name}</span>
                        </div>
                        <div class="score">
                            ${
                              status.long === "Not Started"
                                ? "vs"
                                : `${goals.home} - ${goals.away}`
                            }
                        </div>
                        <div class="team">
                            <img src="${teams.away.logo}" alt="${
        teams.away.name
      }">
                            <span>${teams.away.name}</span>
                        </div>
                    </div>
                    <div class="match-info">
                        <div class="match-time">
                            ${
                              status.long === "Not Started"
                                ? new Date(fixture.date).toLocaleString()
                                : status.short
                            }
                        </div>
                        <button class="btn btn-favorite">★</button>
                    </div>
                </a>
            </div>
        `;
      fixturesContainer.appendChild(fixtureItem);
    });
  }
  let allFixtures = []; // Store all fixtures data

  function filterFixtures(statusFilter) {
    if (statusFilter === "all") {
      renderFixtures(allFixtures);
    } else {
      const filteredFixtures = allFixtures.filter((fixtureData) => {
        const status = fixtureData.fixture.status.short;
        if (statusFilter === "finished") {
          return status === "FT" || status === "PEN" || status === "AET";
        } else if (statusFilter === "not_started") {
          return (
            status === "NS" ||
            status === "TBD" ||
            status === "CANC" ||
            status === "PST" ||
            status === "ABD"
          );
        } else if (statusFilter === "live") {
          return (
            status === "1H" ||
            status === "2H" ||
            status === "HT" ||
            status === "LIVE" ||
            status === "P" ||
            status === "BT" ||
            status === "ET" ||
            status === "SUSP" ||
            status === "INT"
          );
        }
      });
      renderFixtures(filteredFixtures);
    }
  }

  document.querySelectorAll("#filter-buttons .btn").forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      filterFixtures(filter);
    });
  });

 function renderSeasons(tournament) {
   const seasonList = document.getElementById("season-list");
   seasonList.innerHTML = "";
   tournament.seasons.forEach((season) => {
     const listItem = document.createElement("a");
     listItem.href = "#";
     listItem.className = "list-group-item list-group-item-action season-link";
     listItem.textContent = season.year;
     listItem.setAttribute("data-id", tournament.league.id);
     listItem.setAttribute("data-year", season.year);
     seasonList.appendChild(listItem);
   });

   document.getElementById("season-container").style.display = "block";
   document.getElementById("tournament-container").style.display = "none";
   document.getElementById("all-tournaments-container").style.display = "none";

   document.querySelectorAll(".season-link").forEach((link) => {
     link.addEventListener("click", function (e) {
       e.preventDefault();
       const leagueId = this.getAttribute("data-id");
       const seasonYear = this.getAttribute("data-year");
       fetchFixtures(leagueId, seasonYear);
     });
   });

   // Auto-fetch fixtures for the first season by default
   fetchFixtures(tournament.league.id, tournament.seasons[0].year);
 }

  function renderTournaments(tournaments) {
    const list = document.getElementById("tournament-list");
    list.innerHTML = "";
    tournaments.slice(0, 10).forEach((tournament) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `
            <img src="${tournament.league.logo}" alt="${tournament.league.name} Logo">
            <a href="#" data-id="${tournament.league.id}" class="tournament-link">${tournament.league.name}</a>
            <span>(${tournament.country.name})</span>
        `;
      list.appendChild(listItem);
    });

    document.querySelectorAll(".tournament-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const leagueId = this.getAttribute("data-id");
        const selectedTournament = tournaments.find(
          (tournament) => tournament.league.id == leagueId
        );
        renderSeasons(selectedTournament);
      });
    });
  }

  function renderAllTournaments(tournaments) {
    const list = document.getElementById("tournament-list");
    list.innerHTML = "";
    tournaments.forEach((tournament) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `
            <img src="${tournament.league.logo}" alt="${tournament.league.name} Logo">
            <a href="#" data-id="${tournament.league.id}" class="tournament-link">${tournament.league.name}</a>
            <span>(${tournament.country.name})</span>
        `;
      list.appendChild(listItem);
    });

    document.querySelectorAll(".tournament-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const leagueId = this.getAttribute("data-id");
        const selectedTournament = tournaments.find(
          (tournament) => tournament.league.id == leagueId
        );
        renderSeasons(selectedTournament);
      });
    });
  }


  function showLoader() {
    document.getElementById("loader").style.display = "block";
  }

  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }

  const cachedTournaments = localStorage.getItem(CACHE_KEY);
  const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
  const isCacheValid =
    cachedTournaments && cacheExpiry && Date.now() < cacheExpiry;

if (isCacheValid) {
    const tournaments = JSON.parse(cachedTournaments);
    renderPage(tournaments);
    document
      .getElementById("all-tournaments-link")
      .addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Ready");
        renderAllTournaments(tournaments);
      });
  } else {
    fetchTournaments();
  }
});
// Back button functionality
document.getElementById("back-button").addEventListener("click", function () {
  document.getElementById("season-container").style.display = "none";
  document.getElementById("tournament-container").style.display = "block";
  document.getElementById("all-tournaments-container").style.display = "none";
});


async function fetchMatchApi(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


// Function to fetch match information
function fetchMatchInfo(matchId) {
  const endpoint = `/fixtures?id=${matchId}`;
  return fetchMatchApi(endpoint);
}

// Function to fetch lineups for a match
function fetchLineups(matchId) {
  const endpoint = `/lineups?id=${matchId}`;
  return fetchMatchApi(endpoint);
}

// Function to fetch match statistics
function fetchStatistics(matchId) {
  const endpoint = `/statistics?id=${matchId}`;
  return fetchMatchApi(endpoint);
}

// Function to fetch head-to-head information
function fetchHeadToHead(team1Id, team2Id) {
  const endpoint = `/h2h?home=${team1Id}&away=${team2Id}`;
  return fetchMatchApi(endpoint);
}

// Function to fetch standings for a league
function fetchStandings(leagueId, season) {
  const endpoint = `/standings?league=${leagueId}&season=${season}`;
  return fetchMatchApi(endpoint);
}


// Fetch
function getMatchInfo(matchId) {
  fetchMatchInfo(matchId).then((data) => {
    // Fixture: Recommended Calls : 1 call per minute for the leagues, teams, fixtures who have at least one fixture in progress otherwise 1 call per day.
    const match = data.data;
    const mdate = new Date(match.fixture.date);
    const mtime = new Date(match.fixture.date);
    // Update DOM elements with fetched data
    document.getElementById(
      "league-name"
    ).textContent = `${match.league.name} - ${match.league.round}`;
    document.getElementById("league-logo").src = match.league.logo;
    document.getElementById("home-logo").src = match.teams.home.logo;
    document.getElementById("away-logo").src = match.teams.away.logo;
    document.getElementById("homeTeamName").textContent = match.teams.home.name;
    document.getElementById("awayTeamName").textContent = match.teams.away.name;
    document.getElementById(
      "matchDate"
    ).innerHTML = `${mdate.toLocaleDateString()} at <strong>${mtime.toLocaleTimeString()}</strong>`;
    document.getElementById("homeScore").textContent = match.goals.home;
    document.getElementById("awayScore").textContent = match.goals.away;
    document.getElementById(
      "matchReferee"
    ).innerHTML = `Referee: <strong>${match.fixture.referee}</strong>`;

    const status = match.fixture.status;
    let matchStatus = "";
    let color = "";
    if (
      status.short === "NS" ||
      status.short === "TBD" ||
      status.short === "CANC" ||
      status.short === "PST" ||
      status.short === "ABD"
    ) {
      matchStatus = "Upcoming";
      color = "yellow";
    } else if (
      status.short === "1H" ||
      status.short === "2H" ||
      status.short === "HT" ||
      status.short === "LIVE" ||
      status.short === "P" ||
      status.short === "BT" ||
      status.short === "ET" ||
      status.short === "SUSP" ||
      status.short === "INT"
    ) {
      matchStatus = "Live";
      color = "green";
      // document.getElementById("is-live").textContent = matchStatus;
      document.getElementById("matchTime").innerHTML = `${
        status.elapsed + "'"
      }`;
    } else if (
      status.short === "FT" ||
      status.short === "PEN" ||
      status.short === "AET"
    ) {
      matchStatus = "Finished";
      color = "red";
    }

    document.getElementById("is-live").innerHTML = matchStatus;
    document.getElementById("match-status-dot").style.backgroundColor = color;
    document.getElementById("matchTime").innerHTML = `${status.elapsed + "'"}`;

    renderMatchSummary(match);
    if (
      match.statistics &&
      Array.isArray(match.statistics) &&
      match.statistics.length > 0
    ) {
      renderStatistics(match); // Render the statistics tab content
    } else {
      // Hide the statistics tab
      const statisticsTab = document.getElementById("statistic");
      if (statisticsTab) {
        statisticsTab.style.display = "none"; // Hide the tab if it exists
      }
    }

    if (
      match.lineups &&
      Array.isArray(match.lineups) &&
      match.lineups.length > 0
    ) {
      window.onload = init_lineups(match); // Render the statistics tab content
    } else {
      // Hide the statistics tab
      const LineupTab = document.getElementById("line-up");
      if (LineupTab) {
        LineupTab.style.display = "none"; // Hide the tab if it exists
      }
    }
    renderHeadToHead(match);
    renderStandings(match);
  });
};

function renderMatchSummary(data) {
  const summaryContainer = document.getElementById("match-summary");
  summaryContainer.innerHTML = "";

  const events = data.events || [];
  const matchInfo = {
    referee: data.fixture.referee || "N/A",
    venue: data.fixture.venue.name || "N/A",
    capacity: data.fixture.venue.capacity || "N/A",
    attendance: data.fixture.attendance || "N/A",
  };

  // Check match status to determine which events to display
  let firstHalfEvents = [];
  let secondHalfEvents = [];
  let matchStatus = "Not Started";

  if (data.fixture.status.short === "1H") {
    firstHalfEvents = events.filter((event) => event.time.elapsed <= 45);
    matchStatus = "1st Half";
  } else if (data.fixture.status.short === "2H") {
    firstHalfEvents = events.filter((event) => event.time.elapsed <= 45);
    secondHalfEvents = events.filter((event) => event.time.elapsed > 45);
    matchStatus = "2nd Half";
  } else if (data.fixture.status.short === "FT") {
    firstHalfEvents = events.filter((event) => event.time.elapsed <= 45);
    secondHalfEvents = events.filter((event) => event.time.elapsed > 45);
    matchStatus = "Match Finished";
  }

  const renderEvents = (events) => {
    return events
      .map((event) => {
        let eventTypeClass = event.type.toLowerCase();
        if (event.type === "Card") {
          eventTypeClass = event.detail === "Yellow Card" ? "yellow" : "red";
        }

        return `
                <div class="${
                  event.team.id === data.teams.home.id
                    ? "home-event"
                    : "away-event"
                }">
                    <div class="time">${event.time.elapsed}'</div>
                    <div class="desc"><span class="${eventTypeClass}">${
          event.player.name
        }</span> (${event.detail})</div>
                </div>
            `;
      })
      .join("");
  };


  const firstHalfHTML = `
        <div class="half">
            <h3>1ST HALF</h3>
            ${renderEvents(firstHalfEvents)}
        </div>
    `;

  const secondHalfHTML =
    secondHalfEvents.length > 0
      ? `
        <div class="half">
            <h3>2ND HALF</h3>
            ${renderEvents(secondHalfEvents)}
        </div>
    `
      : "";

  const matchInfoHTML = `
        <div class="match-information">
            <h3>Match Information</h3>
            <div class="info-row">
                <span class="label">MATCH STATUS:</span>
                <span class="value">${matchStatus}</span>
            </div>
            <div class="info-row">
                <span class="label">REFEREE:</span>
                <span class="value">${matchInfo.referee}</span>
            </div>
            <div class="info-row">
                <span class="label">VENUE:</span>
                <span class="value">${matchInfo.venue}</span>
            </div>
        </div>
    `;

  summaryContainer.innerHTML = firstHalfHTML + secondHalfHTML + matchInfoHTML;
}

function renderStatistics(match) {
  stats = match.statistics;
  const statsContainer = document.querySelector(".stats");
  statsContainer.innerHTML = ""; // Clear any existing content

  // Assume there are exactly two teams
  const team1Stats = match.statistics[0];
  const team2Stats = match.statistics[1];

  // Create a dictionary of statistics for quick access
  const team1StatsDict = {};
  team1Stats.statistics.forEach((stat) => {
    team1StatsDict[stat.type] = stat.value;
  });

  const team2StatsDict = {};
  team2Stats.statistics.forEach((stat) => {
    team2StatsDict[stat.type] = stat.value;
  });

  // Generate the combined statistics elements
  for (const type in team1StatsDict) {
    const homeValue = team1StatsDict[type];
    const awayValue = team2StatsDict[type] || 0;

    const homePercentage = (homeValue / (homeValue + awayValue)) * 100;
    const awayPercentage = (awayValue / (homeValue + awayValue)) * 100;

    const statElement = document.createElement("div");
    statElement.className = "stat";
    statElement.innerHTML = `
            <div class="team-value">${homeValue}</div>
            <div class="stat-name">${type}</div>
            <div class="team-value">${awayValue}</div>
            <div class="bar-container">
                <div class="bar red" style="width: ${homePercentage}%;"></div>
                <div class="bar white" style="width: ${awayPercentage}%; left: ${homePercentage}%;"></div>
            </div>
        `;
    statsContainer.appendChild(statElement);
  }
}

function renderHeadToHead(match) {
  fetchHeadToHead(match.teams.home.id, match.teams.away.id).then((data) => {
    // Recommended Calls : 1 call per minute for the leagues, teams, fixtures who have at least one fixture in progress otherwise 1 call per day.
    const matches = data.data;
    const tbody = document.querySelector(".h2h-table tbody");
    tbody.innerHTML = ""; // Clear any existing rows

    matches.forEach((match) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${new Date(match.fixture.date).toLocaleDateString()}</td>
            <td><img src="${match.league.logo}" alt="${match.league.name}"> ${
        match.league.name
      }</td>
            <td><img src="${match.teams.home.logo}" alt="${
        match.teams.home.name
      }"> ${match.teams.home.name}</td>
            <td>${match.score.fulltime.home} - ${match.score.fulltime.away}</td>
            <td><img src="${match.teams.away.logo}" alt="${match.teams.away.name}"> ${
        match.teams.away.name
      }</td>
        `;
      tbody.appendChild(row);
    });
  });
}

function renderLineup(lineup, containerId) {
  // Recommended Calls : 1 call every 15 minutes for the fixtures in progress otherwise 1 call per day.
  const container = document.getElementById(containerId);
  

  const positions = {
    G: container.querySelector(".goalkeepers"),
    GK: container.querySelector(".goalkeepers"),
    D: container.querySelector(".defenders"),
    DF: container.querySelector(".defenders"),
    M: container.querySelector(".midfielders"),
    MF: container.querySelector(".midfielders"),
    F: container.querySelector(".forwards"),
    FW: container.querySelector(".forwards"),
  };
  // console.log(positions);
  // container.innerHTML = "";

  lineup.startXI.forEach((playerInfo) => {
    const player = playerInfo.player;
    const positionClass = player.pos;
    const playerElement = document.createElement("div");
    playerElement.className = "player-container";
    playerElement.style.backgroundColor = `#${lineup.team.colors.player.primary}`;
    playerElement.style.color = `#${lineup.team.colors.player.number}`;
    playerElement.style.borderColor = `#${lineup.team.colors.player.border}`;
    playerElement.innerHTML = `
      <div class="player">${player.pos}</div>
      <div class="player-name">${player.name}</div>
    `;
    console.log(positions[positionClass]);
    positions[positionClass].appendChild(playerElement);
    // container.append()
  });
}

function renderSubstitutes(substitutes, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  substitutes.forEach((playerInfo) => {
    const player = playerInfo.player;
    const substituteElement = document.createElement("div");
    substituteElement.className = "substitute";
    substituteElement.innerHTML = `
                <div class="number">${player.number}</div>
                <div class="player">${player.name}</div>
            `;
    container.appendChild(substituteElement);
  });
}

function init_lineups(match) {
  const homeTeam = match.lineups[0];
  const awayTeam = match.lineups[1];

  renderLineup(homeTeam, "team1-lineup");
  renderLineup(awayTeam, "team2-lineup");

  renderSubstitutes(homeTeam.substitutes, "substitutes-home");
  renderSubstitutes(awayTeam.substitutes, "substitutes-away");
}

fetchStatistics(matchId).then((data) => {
  // Recommended Calls : 1 call every minute for the teams or fixtures who have at least one fixture in progress otherwise 1 call per day.
  console.log("Statistics:", data);
});

function renderStandings(match) {
  fetchStandings(match.league.id, match.league.season).then((data) => {
    // Recommended Calls : 1 call per hour for the leagues or teams who have at least one fixture in progress otherwise 1 call per day.
    console.log(data.data);
    const pTableSeason = document.getElementById("table-season");
    const pLeagueName = document.getElementById("p-league-name");
    const pLeagueLogo = document.getElementById("p-league-logo");
    pLeagueName.innerHTML = data.data[0].league.name;
    pTableSeason.innerHTML = data.data[0].league.season;
    pLeagueLogo.src = data.data[0].league.logo;
    const standings = data.data[0].league.standings[0];
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; // Clear any existing rows

    standings.forEach((teamData, index) => {
      const { rank, team, points, goalsDiff, all } = teamData;
      const { played, win, draw, lose } = all;
      const row = document.createElement("tr");
      row.className = index < 4 ? "top" : ""; // Add class 'top' for top 4 teams
      row.innerHTML = `
            <td data-label="Pos.">${rank}</td>
            <td data-label="Teams" class="name"><img class="logo" src="${team.logo}" alt="${team.name}">&nbsp;&nbsp; ${team.name}</td>
            <td data-label="P">${played}</td>
            <td data-label="W">${win}</td>
            <td data-label="D">${draw}</td>
            <td data-label="L">${lose}</td>
            <td data-label="GD">${goalsDiff}</td>
            <td data-label="POINTS">${points}</td>
        `;
      tbody.appendChild(row);
    });
  });
}