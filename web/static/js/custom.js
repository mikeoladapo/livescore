// Function to toggle the side navigation
function toggleSideNav() {
  const sideNav = document.getElementById("sideNav");
  const navContent = document.querySelector(".side-nav-content");
  // Toggle the width of sideNav
  sideNav.style.width = sideNav.style.width === "250px" ? "0" : "250px";

  // Toggle visibility of navContent
  if (sideNav.style.width === "250px") {
    navContent.style.display = "block";
  } else {
    navContent.style.display = "none";
  }
}

function openTeam(evt, teamName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(teamName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Function to get the current date in 'YYYY-MM-DD' format
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function openTab(event, tabName) {
  const tabContent = document.getElementsByClassName("tab-pane");
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].className = tabButtons[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";

  const matchId = getUrlParameter("m");
  const team1Id = getUrlParameter("t1");
  const team2Id = getUrlParameter("t2");
  const leagueId = getUrlParameter("l");

  switch (tabName) {
    case "line-ups":
      loadLineups(matchId);
      break;
    case "h2h":
      loadHeadToHead(team1Id, team2Id);
      break;
    case "statistics":
      loadStatistics(matchId);
      break;
    case "table":
      loadStandings(leagueId);
      break;
    default:
      break;
  }
}

function toggleSection(sectionId) {
  const sections = document.querySelectorAll(".sidebar-section");
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.toggle("active");
      // Change chevron to back arrow when section is active
      const chevron = section.querySelector(".arrow i");
      if (section.classList.contains("active")) {
        chevron.classList.remove("fa-chevron-right");
        chevron.classList.add("fa-chevron-left");
      } else {
        chevron.classList.remove("fa-chevron-left");
        chevron.classList.add("fa-chevron-right");
      }
    } else {
      section.classList.remove("active");
      // Ensure other sections have the right chevron icon
      const chevron = section.querySelector(".arrow i");
      chevron.classList.remove("fa-chevron-left");
      chevron.classList.add("fa-chevron-right");
    }
  });

  // Hide other sections when one is active
  sections.forEach((section) => {
    if (section.id !== sectionId) {
      section.style.display = document
        .getElementById(sectionId)
        .classList.contains("active")
        ? "none"
        : "block";
    } else {
      section.style.display = "block";
    }
  });
}

function formatDateTime(dateTimeStr) {
  // Ensure the input is a string of length 14
  if (dateTimeStr.length !== 14 || isNaN(dateTimeStr)) {
    return null; // Invalid input
  }

  // Extract date and time parts from the string
  const year = dateTimeStr.slice(0, 4);
  const month = dateTimeStr.slice(4, 6);
  const day = dateTimeStr.slice(6, 8);
  const hours = dateTimeStr.slice(8, 10);
  const minutes = dateTimeStr.slice(10, 12);
  const seconds = dateTimeStr.slice(12, 14);

  // Create a Date object
  const date = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  );

  // Format the date and time separately
  const formattedDate = date.toLocaleDateString(); // Default date format based on locale
  const formattedTime = date.toLocaleTimeString(); // Default time format based on locale

  return { date: formattedDate, time: formattedTime };
}


// Function to create a loading icon
const showLoading = () => {
  sidebar.innerHTML = `
    <div class="loading-icon">
      <div class="spinner"></div>
    </div>`;
};

const showLoadingOnMain = () => {
  const mainContent = document.querySelector(".scores");
  mainContent.innerHTML = `
    <div class="loading-icon">
      <div class="spinner"></div>
    </div>`;
};

let allFixtures = [];
let filteredFixtures = [];
let currentView = 'live'; // State variable to track current view

function displayFilterButtons() {
  const mainContent = document.querySelector(".scores");
  let filterTab = document.createElement("div");
  filterTab.className = "filter-buttons";
  filterTab.innerHTML = `
    <button id="live-button" onclick="filterMatches('live')">Live Matches</button>
    <button id="finished-button" onclick="filterMatches('finished')">Finished Matches</button>
    <button id="upcoming-button" onclick="filterMatches('upcoming')">Upcoming Matches</button>`;
  mainContent.append(filterTab);
}

function filterMatches(filter) {
  // Clear active class from all buttons
  document.querySelectorAll(".filter-buttons button").forEach((button) => {
    button.classList.remove("active");
  });

  // Set active class on the clicked button
  const filterButton = document.getElementById(`${filter}-button`);
  // if (filterButton) {
  filterButton.classList.add("active");
  // }

  if (filter === "live") {
    filteredFixtures = allFixtures.filter(
      (fixture) =>
        fixture.fixture.status.short !== "NS" &&
        fixture.fixture.status.short !== "FT"
    );
  } else if (filter === "finished") {
    filteredFixtures = allFixtures.filter(
      (fixture) => fixture.fixture.status.short === "FT"
    );
  } else if (filter === "upcoming") {
    filteredFixtures = allFixtures.filter(
      (fixture) => fixture.fixture.status.short === "NS"
    );
  }
  displayFixtures(filteredFixtures);
}

// Function to fetch live fixtures
const fetchLiveFixtures = async () => {
  try {
    const response = await fetch("/all-fixtures/");
    const data = await response.json();
    return data.fixtures.response;
  } catch (error) {
    console.error('Error fetching live fixtures:', error);
    return [];
  }
};

// Function to display fixtures
const displayHomeFixtures = (fixtures) => {
  const mainContent = document.querySelector('.scores');
  mainContent.innerHTML = '';

  fixtures.forEach(fixture => {
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group';
    groupHeader.innerHTML = `
      <h4>
        <img src="${fixture.league.logo}" alt="Logo" class="group-logo">
        <span class="group-title">${fixture.league.name}</span>
        <span class="country-name">${fixture.league.country}</span>
      </h4>
    `;

    const matchLink = document.createElement('a');
    matchLink.href = `/match_detail/${fixture.fixture.id}/overview/?t1=${fixture.teams.home.id}&t2=${fixture.teams.away.id}&l=${fixture.fixture.id}&m=${fixture.fixture.id}`;
    matchLink.className = 'match-link';
    matchLink.onclick = () => {
      currentView = "match_detail"; // Update the state when clicking on a match link
    };

    const matchItem = document.createElement('div');
    matchItem.className = 'match';

    let scoreHTML = `
      <span class="score">${fixture.goals.home ?? '-'}</span>
      <span class="score">${fixture.goals.away ?? '-'}</span>`;

    let matchInfoHTML = `
      <div class="match-info">
        <span class="status">${fixture.fixture.status.short}</span>
        <span class="time">${fixture.fixture.status.elapsed}'</span>
        ${fixture.fixture.status.short !== 'FT' ? '<span class="live-dot"></span>' : ''}
      </div>`;

    matchItem.innerHTML = `
      <div class="team">
        <img src="${fixture.teams.home.logo}" alt="${fixture.teams.home.name} Logo" class="team-logo">
        <span>${fixture.teams.home.name}</span>
      </div>
      ${scoreHTML}
      <div class="team">
        <img src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name} Logo" class="team-logo">
        <span>${fixture.teams.away.name}</span>
      </div>
      ${matchInfoHTML}
    `;

    matchLink.appendChild(matchItem);
    groupHeader.appendChild(matchLink);
    mainContent.appendChild(groupHeader);
  });
};

const isHomePage = window.location.pathname === "/";

// Function to update live fixtures every minute
const updateLiveFixtures = async () => {
  if (currentView === 'live') {
    const liveFixtures = await fetchLiveFixtures();
    displayHomeFixtures(liveFixtures);
  }
};

// Initial setup to update live fixtures on the homepage
document.addEventListener("DOMContentLoaded", () => {
    if (isHomePage) {
      // Initial fetch and setup interval for updating live fixtures every minute
      updateLiveFixtures();
      setInterval(updateLiveFixtures, 60000); // 60000 ms = 1 minute
    }
});

function formatDateTime2(dateTimeString) {
  const date = new Date(dateTimeString);

  // Extract the date
  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + date.getUTCDate()).slice(-2);

  // Extract the time
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);

  // Format the date and time
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes} UTC`;

  return { date: formattedDate, time: formattedTime };
}


const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

function displayFixtures(fixtures) {
  const mainContent = document.querySelector(".scores");
  mainContent.innerHTML = ""; // Clear previous content

  displayFilterButtons(); // Ensure filter buttons are always displayed

  if (fixtures.length > 0) {
    fixtures.forEach((fixture) => {
      const formattedDateTime = formatDateTime(matchDateTime);
      const matchLink = document.createElement("a");
      matchLink.href = `/match_detail/${fixture.fixture.id}/overview/?t1=${fixture.teams.home.id}&t2=${fixture.teams.away.id}&l=${fixture.fixture.id}&m=${fixture.fixture.id}`;
      matchLink.className = "match-link";

      const matchItem = document.createElement("div");
      matchItem.className = "match";

      let scoreHTML = "";
      let matchInfoHTML = "";
      if (fixture.fixture.status.short === "NS") {
        scoreHTML = `
          <span class="score"></span>
          <span class="score"></span>`;
        matchInfoHTML = `
          <div class="match-info">
            <span class="status">${new Date(
              fixture.fixture.date
            ).toLocaleDateString()}</span>
            <span class="time">${new Date(
              fixture.fixture.date
            ).toLocaleTimeString()}</span>
          </div>`;
      } else {
        scoreHTML = `
          <span class="score">${fixture.goals.home}</span>
          <span class="score">${fixture.goals.away}</span>`;
        matchInfoHTML = `
          <div class="match-info">
            <span class="time">${fixture.fixture.status.short}</span>`;
        if (fixture.fixture.status.short !== "FT") {
          matchInfoHTML += `<span class="live-dot"></span>`;
        }
        matchInfoHTML += `</div>`;
      }

      matchItem.innerHTML = `
        <div class="team">
          <img src="${fixture.teams.home.logo}" class="team-logo" alt="${fixture.teams.home.name}">
          <span>${fixture.teams.home.name}</span>
        </div>
        ${scoreHTML}
        <div class="team">
          <img src="${fixture.teams.away.logo}" class="team-logo" alt="${fixture.teams.away.name}">
          <span>${fixture.teams.away.name}</span>
        </div>
        ${matchInfoHTML}
      `;

      matchLink.appendChild(matchItem);
      mainContent.appendChild(matchLink);
    });
  } else {
    const noMatchesMessage = document.createElement("div");
    noMatchesMessage.className = "no-matches";
    noMatchesMessage.textContent = "No matches found.";
    mainContent.appendChild(noMatchesMessage);
  }
}


const fetchSeasonFixtures = async (leagueId, season) => {
  try {
    const response = await fetch(
      `/fetch-fixtures/${leagueId}/?season=${season}`);
    const data = await response.json();
    allFixtures = data.data;
    return data;
  } catch (error) {
    console.error("Error fetching season fixtures:", error);
    return [];
  }
};

function fetchData() {
  return new Promise((resolve, reject) => {
    const url = `/leagues/`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching leagues:", error);
        reject(error);
      });
  });
}

const showSeasonFixtures = async (league, season) => {
  currentView = "season"; // Update the state to season view
  showLoadingOnMain();
  const seasonFixtures = await fetchSeasonFixtures(league.league.id, season);
  displayFixtures(seasonFixtures);
};

const buildSidebar = (data) => {
  const sidebar = document.getElementById("sidebar");

  const createSection = (title, items) => {
    let section = document.createElement("div");
    section.className = "sidebar-section";
    section.id = title.toLowerCase().replace(" ", "-");

    let header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `<span>${title}</span><span class="arrow"><i class="fa fa-chevron-right"></i></span>`;
    header.onclick = () => toggleSection(section.id);
    section.appendChild(header);

    if (Array.isArray(items) && items.length > 0) {
      items.slice(0, 20).forEach((league) => {
        let sidebarItem = document.createElement("div");
        sidebarItem.className = "sidebar-item";
        sidebarItem.innerHTML = `<img src="${league.league.logo}" alt="${league.league.name}"><span>${league.league.name}</span>`;
        sidebarItem.innerHTML += `<span class="subtext">${league.country.name}</span>`;
        sidebarItem.dataset.leagueId = league.league.id;
        sidebarItem.onclick = () => showSeasons(league);
        section.appendChild(sidebarItem);
      });

      // Create a "Show All" button to display all leagues
      let showAllButton = document.createElement("div");
      showAllButton.className = "sidebar-item show-all";
      showAllButton.textContent = "Show All";
      showAllButton.onclick = () => {
        section.innerHTML = "";
        section.appendChild(header);
        items.forEach((league) => {
          let sidebarItem = document.createElement("div");
          sidebarItem.className = "sidebar-item";
          sidebarItem.innerHTML = `<img src="${league.league.logo}" alt="${league.league.name}"><span>${league.league.name}</span>`;
          sidebarItem.innerHTML += `<span class="subtext">${league.country.name}</span>`;
          sidebarItem.dataset.leagueId = league.league.id;
          sidebarItem.onclick = () => showSeasons(league);
          section.appendChild(sidebarItem);
        });
      };
      section.appendChild(showAllButton);
    } else {
      let noItemsMessage = document.createElement("div");
      noItemsMessage.className = "no-items-message";
      noItemsMessage.textContent = "No items found.";
      section.appendChild(noItemsMessage);
    }

    sidebar.appendChild(section);
  };

  const showSeasons = (league) => {
    currentView = "seasons"; // Update the state to seasons view
    showLoadingOnMain();
    const mainContent = document.querySelector(".scores");
    mainContent.innerHTML = "";

    let header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `<span>Seasons for ${league.league.name}</span><span class="arrow"><i class="fa fa-chevron-left"></i></span>`;
    header.onclick = () => buildSidebar(data);
    mainContent.appendChild(header);

    league.seasons.forEach((season) => {
      let seasonItem = document.createElement("div");
      seasonItem.className = "sidebar-item";
      seasonItem.innerHTML = `<span>${season.year}</span>`;
      seasonItem.onclick = () => showSeasonFixtures(league, season.year);
      mainContent.appendChild(seasonItem);
    });
  };

  createSection("Leagues", data);
};

// Initial data fetch and sidebar setup
fetchData().then((data) => buildSidebar(data.leagues));


  // Extract match ID from URL
function getMatchIdFromURL() {
  const pathParts = window.location.pathname.split("/");
  return pathParts[pathParts.length - 2];
}

function convertFormationArrayToString(formationArray) {
  if (!Array.isArray(formationArray)) {
    console.error("Invalid formation array");
    return null;
  }
  return formationArray.join("-");
}


// Function to fetch data from a specific endpoint
const fetchMatchData = async (endpoint, params = '') => {
    try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return [];
    }
};

// Function to fetch and display lineups
const loadLineups = async (matchId) => {
    const lineups = await fetchMatchData(
      `/fixtures/lineups/${matchId}`,
      `fixture=${matchId}`
    );
    // if (lineups.length > 0) {
      displayLineups(lineups);
    // }
};

// Function to fetch and display head-to-head data
const loadHeadToHead = async (team1Id, team2Id) => {
    const h2h = await fetchMatchData(
      `/fixtures/headtohead/${team1Id}/${team2Id}`,
      `h2h=${team1Id}-${team2Id}`
    );
    if (h2h.length > 0) {
        displayHeadToHead(h2h);
    }
};

// Function to fetch and display statistics
const loadStatistics = async (matchId) => {
    const statistics = await fetchMatchData(
      `/fixtures/statistics/${matchId}`,
      `fixture=${matchId}`
    );
    if (statistics.length > 0) {
        displayStatistics(statistics);
    }
};

// Function to fetch and display events
const loadEvents = async (matchId) => {
    const events = await fetchMatchData(
      `/fixtures/events/${matchId}`,
      `fixture=${matchId}`
    );
    if (events.length > 0) {
        displayEvents(events);
    }
};

// Function to fetch and display injuries
const loadInjuries = async (teamId) => {
    const injuries = await fetchMatchData(
      `/injuries/${matchId}`,
      `team=${teamId}`
    );
    if (injuries.length > 0) {
        displayInjuries(injuries);
    }
};

// Function to fetch and display transfers
const loadTransfers = async (teamId) => {
    const transfers = await fetchMatchData(
      `/fixtures/transfers`,
      `team=${teamId}`
    );
    if (transfers.length > 0) {
        displayTransfers(transfers);
    }
};

// Function to fetch and display standings
const loadStandings = async (leagueId) => {
    const standings = await fetchMatchData(
      `/fixtures/standings/${leagueId}`,
      `league=${leagueId}`
    );
    if (standings.length > 0) {
        displayStandings(standings);
    }
};

// Function to display data in the DOM
const displayLineups = (data) => {
  const lineups = data.lineups;
  const team1 = lineups[0];
  const team2 = lineups[1];

  document.getElementById("formation-A").innerHTML = team1.formation;
  document.getElementById("formation-B").innerHTML = team2.formation;

  const team1Formation = document.getElementById("formation-team1");
  const team2Formation = document.getElementById("formation-team2");
  const substitutesTeam1 = document.getElementById("substitutes-team1");
  const substitutesTeam2 = document.getElementById("substitutes-team2");

  const createPlayerDiv = (player, colors) => {
    return `
      <div class="player" style="background-color: #${colors.player.primary}; color: #${colors.player.number}; border: 2px solid #${colors.player.border};">
        <span>${player.number}</span>
        <span>${player.name}</span>
      </div>
    `;
  };

  const createPositionDivs = (players, colors) => {
    const positions = { G: [], D: [], M: [], F: [] };

    players.forEach((player) => {
      positions[player.pos].push(createPlayerDiv(player, colors));
    });

    return `
      <div class="goalkeeper">${positions.G.join("")}</div>
      <div class="defender">${positions.D.join("")}</div>
      <div class="midfielder">${positions.M.join("")}</div>
      <div class="forward">${positions.F.join("")}</div>
    `;
  };

  const createSubstituteDiv = (player, colors) => {
    return `
      <div class="substitute" style="background-color: #${colors.primary}; color: #${colors.number}; border: 2px solid #${colors.border};">
        <span>${player.number}</span>
        <span>${player.name}</span>
      </div>
    `;
  };

  team1Formation.innerHTML = "";
  team2Formation.innerHTML = "";
  substitutesTeam1.innerHTML = "";
  substitutesTeam2.innerHTML = "";

  team1Formation.innerHTML += createPositionDivs(
    team1.startXI.map((p) => p.player),
    team1.team.colors
  );
  team2Formation.innerHTML += createPositionDivs(
    team2.startXI.map((p) => p.player),
    team2.team.colors
  );

  team1.substitutes.forEach((player) => {
    const colors =
      player.player.pos === "G"
        ? team1.team.colors.goalkeeper
        : team1.team.colors.player;
    substitutesTeam1.innerHTML += createSubstituteDiv(player.player, colors);
  });

  team2.substitutes.forEach((player) => {
    const colors =
      player.player.pos === "G"
        ? team2.team.colors.goalkeeper
        : team2.team.colors.player;
    substitutesTeam2.innerHTML += createSubstituteDiv(player.player, colors);
  });
};


const displayHeadToHead = (h2h) => {
    // Code to display head-to-head information in the H2H tab
};

const displayStatistics = (statistics) => {
    // Code to display statistics in the statistics tab
};

const displayEvents = (events) => {
    // Code to display events in the events tab
};

const displayInjuries = (injuries) => {
    // Code to display injuries in the injuries tab
};

const displayTransfers = (transfers) => {
    // Code to display transfers in the transfers tab
};

const displayStandings = (standings) => {
    // Code to display standings in the standings tab
};

// Function to display match info
const displayMatchInfo = (info) => {
  if (info.fixture.status.short == "NS") {
    document.getElementById("match-date").innerHTML = new Date(
              info.fixture.date
            ).toLocaleDateString();
    document.getElementById("match-status").innerHTML = `${new Date(
      info.fixture.date
    ).toLocaleTimeString()}`;
  } else {
    document.getElementById(
      "match-date"
    ).innerHTML = `${info.goals.home} - ${info.goals.away}`;
    document.getElementById(
      "match-status"
    ).innerHTML = `${info.fixture.status.short} - ${info.fixture.status.elapsed}'`;
  }
    document.getElementById("match-date2").innerHTML = info.fixture.date;
    document.getElementById("team-a-name").innerHTML = info.teams.home.name;
    document.getElementById("team-b-name").innerHTML = info.teams.away.name;
    document.getElementById("stadium-name").innerHTML = `${info.fixture.venue.name}, ${info.fixture.venue.city}`;
    document.querySelector('.team img[alt="Team Home"]').src = info.teams.home.logo;
    document.querySelector('.team img[alt="Team Away"]').src = info.teams.away.logo;
};

// Utility function to get URL parameter
// const getUrlParameter = (name) => {
//     name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//     const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//     const results = regex.exec(location.search);
//     return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
// };

// Initial setup to display the first tab and fetch data
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tab-button").click();
    const matchId = getUrlParameter("m");
    if (matchId) {
        fetchMatchData(`/match_data/${matchId}`).then(data => {
            displayMatchInfo(data.info);
            // loadLineups(matchId);
            // loadHeadToHead(data.info.teams.home.id, data.info.teams.away.id);
            // loadStatistics(matchId);
            // loadEvents(matchId);
            // Call other load functions as needed
        });
    }
});
