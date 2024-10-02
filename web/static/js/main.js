"use strict";

/*============================================ 
======== Table of JS Functions =========


============================================*/

document.addEventListener("DOMContentLoaded", function() {
    /*
===============================================================
=> Reusable Functions Start
===============================================================
  */
    // modal toggle function
    function modalToggle(modalName, modalBox, open, close) {
        modalName.addEventListener("click", () => {
            if (modalBox.classList.contains(open)) {
                modalBox.classList.remove(open);
                modalBox.classList.add(close);
                document.removeEventListener("click", closeDropdownOutside);
            } else {
                modalBox.classList.add(open);
                modalBox.classList.remove(close);
                document.addEventListener("click", closeDropdownOutside);
            }

            function closeDropdownOutside(event) {
                const isClickedInsideDropdown = modalBox.contains(event.target);
                const isClickedOnDropdownBtn = modalName.contains(event.target);

                if (!isClickedInsideDropdown && !isClickedOnDropdownBtn) {
                    modalBox.classList.add(close);
                    modalBox.classList.remove(open);
                    document.removeEventListener("click", closeDropdownOutside);
                }
            }
        });
    }

    //select active item
    function selectOneItem(items) {
        if (items) {
            const item = items.querySelectorAll(".item");

            item.forEach((e) =>
                e.addEventListener("click", () => {
                    if (!e.classList.contains("active")) {
                        items.querySelector(".active").classList.remove("active");

                        e.classList.add("active");
                    }
                })
            );
        }
    }

    //select item from modal
    function selectItemFromModal(items, modalBox, slectText) {
        items.forEach((e) =>
            e.addEventListener("click", () => {
                modalBox.classList.remove("modalClose");
                modalBox.classList.add("modalOpen");
                slectText.innerHTML = e.textContent;
            })
        );
    }

    // Modal with different open and close button
    function modalDiffOpenClose(
        modalClass,
        modalOpenButtonClass,
        modalCloseButtonClass,
        closeModalClass,
        openModalClass
    ) {
        const modal = document.querySelector(`.${modalClass}`);
        const modalOpenButton = document.querySelector(`.${modalOpenButtonClass}`);
        const modalCloseButton = document.querySelector(
            `.${modalCloseButtonClass}`
        );

        modal &&
            modalOpenButton.addEventListener("click", () => {
                modal.classList.remove(closeModalClass);
                modal.classList.add(openModalClass);
            });

        modal &&
            modalCloseButton.addEventListener("click", () => {
                modal.classList.remove(openModalClass);
                modal.classList.add(closeModalClass);
            });
    }

    // Select One From Maney Item
    function selectItemFromMany(
        parentClass,
        itemClass,
        activeItemStyle,
        inactiveItemStye
    ) {
        const selectParentClass = document.querySelector(`.${parentClass}`);
        const items = selectParentClass?.querySelectorAll(`.${itemClass}`);

        selectParentClass &&
            items.forEach((e) => {
                e.addEventListener("click", () => {
                    const activeItem = selectParentClass.querySelector(
                        `.${activeItemStyle}`
                    );

                    const inactiveItem = e.querySelector(`.${inactiveItemStye}`);

                    if (inactiveItem) {
                        activeItem.classList.remove(activeItemStyle);
                        activeItem.classList.add(inactiveItemStye);

                        inactiveItem.classList.remove(inactiveItemStye);
                        inactiveItem.classList.add(activeItemStyle);
                    }
                });
            });
    }

    // Select One Item From Many
    function selectOneItem(items) {
        if (items) {
            const item = items.querySelectorAll(".item");

            item.forEach((e) =>
                e.addEventListener("click", () => {
                    if (!e.classList.contains("active")) {
                        items.querySelector(".active").classList.remove("active");

                        e.classList.add("active");
                    }
                })
            );
        }
    }

    function showPasswordFunc(item, passField) {
        item.addEventListener("click", () => {
            if (item.classList.contains("ph-eye-closed")) {
                item.classList.add("ph-eye");
                item.classList.remove("ph-eye-closed");
                passField.setAttribute("type", "text");
            } else {
                item.classList.remove("ph-eye");
                item.classList.add("ph-eye-closed");
                passField.setAttribute("type", "password");
            }
        });
    }

    /*
===============================================================
=> Reusable Functions End
===============================================================
*/

    //preloader
    // const preloader = document.querySelector(".preloader");
    // setTimeout(function () {
    //   preloader && preloader.classList.add("active");
    // }, 0);
    // setTimeout(() => {
    //   preloader && preloader.classList.add("hidden");
    //   preloader && preloader.classList.remove("active");
    // }, 2000);

    function createTab(
        tabArea,
        activeTabButtonClass,
        activeTabClass,
        hiddenTabClass,
        tabButtonClass,
        tabContentClass
    ) {
        const tabButtons = document.querySelectorAll(`.${tabButtonClass}`);
        const tabContent = document.querySelectorAll(`.${tabContentClass}`);

        tabButtons.forEach((e) => {
            e.addEventListener("click", () => {
                if (!e.classList.contains(activeTabClass)) {
                    const activeTabButton = tabArea.querySelector(
                        `.${activeTabButtonClass}`
                    );
                    const tabData = tabArea.querySelector(`#${e.id}_data`);

                    activeTabButton.classList.remove(activeTabButtonClass);
                    e.classList.add(activeTabButtonClass);

                    tabArea
                        .querySelector(`.${activeTabClass}`)
                        .classList.remove(activeTabClass);
                    //Add hiddentab class on every tab data element if the classlist doen't contain hiddentab class
                    tabContent.forEach((e) => {
                        if (!e.classList.contains(hiddenTabClass)) {
                            e.classList.add(hiddenTabClass);
                        }
                    });

                    tabData.classList.remove(hiddenTabClass);
                    tabData.classList.add(activeTabClass);
                }
            });
        });
    }

    const liveMatchTab = document.querySelector(".liveMatchTab");
    liveMatchTab &&
        createTab(
            liveMatchTab,
            "activeTabButton",
            "activeTab",
            "hiddenTab",
            "tabButton",
            "tab-content"
        );

    const playerInfoTab = document.querySelector(".playerInfoTab");
    playerInfoTab &&
        createTab(
            playerInfoTab,
            "activeTabButton",
            "activeTab",
            "hiddenTab",
            "tabButton",
            "tab-content"
        );

    // Check local storage for mode
    const localStorageMode = localStorage.getItem("mode") || "dark"; // Default to dark mode
    const chooseModeButton = document.querySelector(".choose-mode");
    const selectWhiteCircle = chooseModeButton?.querySelector("div");

    function changeMode(mode) {
        if (mode === "dark") {
            document.querySelector("body").classList?.remove("white");
            document.querySelector("body").classList.add("dark");
        } else {
            document.querySelector("body").classList?.remove("dark");
            document.querySelector("body").classList.add("white");
        }
    }

    if (localStorageMode === "dark") {
        changeMode(localStorageMode);

        if (chooseModeButton) {
            chooseModeButton.classList?.remove("bg-n40");
            chooseModeButton.classList?.add("bg-p1");
            selectWhiteCircle.classList?.remove("left-0.5");
            selectWhiteCircle.classList?.add("left-[calc(100%-18px)]");
        }
    } else {
        changeMode("white");
    }

    chooseModeButton?.addEventListener("click", () => {
        if (localStorage.getItem("mode") === "dark") {
            localStorage.setItem("mode", "white");
            changeMode("white");

            chooseModeButton.classList?.remove("bg-p1");
            chooseModeButton.classList?.add("bg-n40");
            selectWhiteCircle.classList?.remove("left-[calc(100%-18px)]");
            selectWhiteCircle.classList?.add("left-0.5");
        } else {
            localStorage.setItem("mode", "dark");
            changeMode("dark");

            chooseModeButton.classList?.remove("bg-n40");
            chooseModeButton.classList?.add("bg-p1");
            selectWhiteCircle.classList?.remove("left-0.5");
            selectWhiteCircle.classList?.add("left-[calc(100%-18px)]");
        }
    });

    // custom switch
    const switchButton = document.querySelectorAll(".rounded-switch");

    switchButton?.forEach((e) => {
        e.addEventListener("click", () => {
            const circleButton = e.querySelector("div");
            if (circleButton.classList.contains("left-0.5")) {
                e.classList.remove("bg-n40");
                e.classList.add("bg-p1");

                circleButton.classList.remove("left-0.5");
                circleButton.classList.add("left-[calc(100%-18px)]");
            } else {
                e.classList.add("bg-n40");
                e.classList.remove("bg-p1");

                circleButton.classList.add("left-0.5");
                circleButton.classList.remove("left-[calc(100%-18px)]");
            }
        });
    });

    // FAQ Item Toggle
    let accordion = document.querySelectorAll(".faq-accordion");

    accordion.forEach((item, index) => {
        accordion[index].addEventListener("click", function() {
            let faqAnswer = this.nextElementSibling;
            let parent = accordion[index].parentElement;

            // Close all other accordions
            accordion.forEach((otherAccordion, otherIndex) => {
                if (otherIndex !== index) {
                    let otherFaqAnswer = otherAccordion.nextElementSibling;
                    otherFaqAnswer.style.height = null;
                    otherAccordion.querySelector("i").classList.remove("text-p1");
                    otherAccordion.parentElement.classList.remove("!border-p1");
                }
            });

            // Toggle open/close for the clicked accordion
            if (faqAnswer.style.height) {
                faqAnswer.style.height = null;
            } else {
                faqAnswer.style.height = faqAnswer.scrollHeight + "px";
            }

            accordion[index].parentElement.classList.add("!border-p1");

            // Toggle classes for the clicked accordion
            accordion[index].querySelector("i").classList.toggle("ph-caret-down");
            accordion[index].querySelector("i").classList.toggle("ph-caret-up");
            accordion[index].querySelector("i").classList.add("text-p1");
        });
    });

    // Country Select Modal
    const selectCountry = document.querySelector("#selectCountry");
    const selectCountryModal = document.querySelector(".selectCountryModal");

    const selectedCountry = document.querySelector(".selectedCountry");
    const sortByItem = selectCountryModal?.querySelectorAll(".sortbyItem");

    selectCountry &&
        modalToggle(selectCountry, selectCountryModal, "modalOpen", "modalClose");

    selectedCountry &&
        selectItemFromModal(sortByItem, selectCountryModal, selectedCountry);

    //Select City Modal
    const selectCity = document.querySelector("#selectCity");
    const selectCityModal = document.querySelector(".selectCityModal");

    const selectedCity = document.querySelector(".selectedCity");
    const sortByItem2 = selectCityModal?.querySelectorAll(".sortbyItem");

    selectCity &&
        modalToggle(selectCity, selectCityModal, "modalOpen", "modalClose");

    selectedCity &&
        selectItemFromModal(sortByItem2, selectCityModal, selectedCity);

    // logout modal
    modalDiffOpenClose(
        "logoutModal",
        "logoutModalButton",
        "logoutCloseButton",
        "hidden",
        "openLogoutModal"
    );

    // Sidebar Modal
    modalDiffOpenClose(
        "sidebarModal",
        "sidebarOpenButton",
        "sidebarCloseButton",
        "closeSidebarModal",
        "openSidebarModal"
    );
    modalDiffOpenClose(
        "sidebarBg",
        "sidebarOpenButton",
        "sidebarCloseButton",
        "hidden",
        "sidebarBgOpen"
    );

    // Select Games From Home Page
    selectItemFromMany(
        "selectGamesFromHeader",
        "game",
        "activeSelectedGame",
        "inactiveSelectedGame"
    );

    selectItemFromMany(
        "selectDate",
        "dateItem",
        "activeSelectDate",
        "inactiveSelectDate"
    );

    //language selectd
    const suggestedItems = document.querySelector(".suggestedItems");
    const otherLanguages = document.querySelector(".otherLanguages");

    suggestedItems && selectOneItem(suggestedItems);
    otherLanguages && selectOneItem(otherLanguages);

    //country modal
    const countryModal2 = document.querySelector(".countryModal2");
    const countryModalBox2 = document.querySelector(".countryModalBox2");

    if (countryModal2) {
        const countryList2 = countryModal2.querySelectorAll(".item");
        const selectedItem = countryModal2.querySelector(".selectedCountry2");

        modalToggle(countryModal2, countryModalBox2, "modalOpen", "modalClose");
        selectItemFromModal(countryList2, countryModalBox2, selectedItem);
    }

    //show password
    const passowordShow = document.querySelector(".passowordShow");
    const passwordField = document.querySelector(".passwordField");
    if (passowordShow) {
        showPasswordFunc(passowordShow, passwordField);
    }
    const confirmPasswordShow = document.querySelector(".confirmPasswordShow");
    const confirmPasswordField = document.querySelector(".confirmPasswordField");
    if (confirmPasswordShow) {
        showPasswordFunc(confirmPasswordShow, confirmPasswordField);
    }
});


// document.addEventListener("DOMContentLoaded", function () {
//   generateDatePicker();
//   fetchLiveMatches();
//   fetchRecentUpdates();
// });

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("homepage-content")) {
        generateDatePicker();
        fetchLiveMatches();
        fetchRecentUpdates();
    }

    if (document.getElementById("show-all-live-matches-content")) {
        fetchLiveMatches2();
        fetchFinishedMatches();
    }
});

function generateDatePicker() {
    const container = document.getElementById("date-picker");
    const today = new Date();
    const dates = [];

    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }

    dates.forEach((date, index) => {
        const day = date.getDate();
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const isActive = index === 3?"activeSelectDate" : "inactiveSelectDate"; // Set the current day as active
        const dateItem = document.createElement("div");
        dateItem.classList.add(
            "flex",
            "justify-center",
            "items-center",
            "flex-col",
            "gap-2",
            "relative",
            "pb-4",
            "dateItem"
        );
        dateItem.innerHTML = `
        <p class="text-xl font-semibold rounded-full size-14 flex justify-center items-center ${isActive}" data-date="${
      date.toISOString().split("T")[0]
    }">
                    ${day}
                </p>
                <p class="text-xs">${weekday}</p>
            `;
        dateItem.addEventListener("click", function() {
            document
                .querySelectorAll(".dateItem p")
                .forEach((el) => el.classList.remove("activeSelectDate"));
            this.querySelector("p").classList.add("activeSelectDate");
            fetchRecentUpdates(this.querySelector("p").dataset.date);
        });
        container.appendChild(dateItem);
    });
}

function fetchLiveMatches() {
    fetch('/api/live-matches/')
        .then((response) => response.json())
        .then((data) => {
            renderLiveMatches(data.response);
        })
        .catch((error) => console.error("Error fetching live matches:", error));
}

function renderLiveMatches(matches) {
    const liveMatchesWrapper = document.getElementById("live-matches-wrapper");
    liveMatchesWrapper.innerHTML = ""; // Clear any existing content

    const leagueIds = [1, 2, 39, 140, 135, 78, 61];
    let prioritizedMatches = [];
    let otherMatches = [];

    // Process matches
    matches.forEach((match) => {
        const leagueId = match.league.id;
        if (leagueIds.includes(leagueId)) {
            prioritizedMatches.push(match);
        } else {
            otherMatches.push(match);
        }
    });

    const orderedMatches = [...prioritizedMatches, ...otherMatches];

    // Render matches
    orderedMatches.forEach((match, index) => {
        const matchElement = document.createElement("div");
        matchElement.classList.add(
            "bg-n900",
            "p-5",
            "rounded-2xl",
            "text-white",
            "swiper-slide",
            "relative"
        );

    matchElement.innerHTML = `
        <img src="/static/images/trophy.png" class="absolute top-0 bottom-0 left-0 -z-10" alt="" />
        <a href="/league-info/${match.league.id}/" class="text-base font-semibold">${match.league.name}</a>
        <p class="text-xs pt-1 pb-6">${match.league.country}</p>
        <div class="flex justify-center items-center w-full border-t border-dashed border-n500">
            <p class="bg-n900 -mt-3 w-fit px-2">VS</p>
        </div>
        <div class="flex justify-between items-center pt-3">
            <a href="/match-detail/${match.fixture.id}/" class="flex justify-center items-center flex-col">
                <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" width="100" />
                <p class="text-base font-semibold text-center pt-3">${match.teams.home.name}</p>
            </a>
            <div class="flex justify-center items-center flex-col gap-3">
                <p class="text-[30px] font-bold">${match.goals.home} : ${match.goals.away}</p>
                <p class="border border-p1 rounded-full text-sm text-p1 py-1 px-5">${match.fixture.status.elapsed}'</p>
            </div>
            <a href="/match-detail/${match.fixture.id}/" class="flex justify-center items-center flex-col">
                <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" width="100" />
                <p class="text-base font-semibold text-center pt-3">${match.teams.away.name}</p>
            </a>
        </div>
    `;


liveMatchesWrapper.appendChild(matchElement);

        // Insert ad after the third match
        if (index === 2) {
            const adElement = document.createElement("div");
            adElement.classList.add(
                "flex",
                "justify-center",
                "items-center",
                "my-4",
                "swiper-slide"
            );
            adElement.innerHTML = `
          <a href="https://www.betway.com.ng/lobby/casino/?btag=P105314-PR37371-CM104006-TS2010123&"; target="_blank" rel="nofollow">
              <img src="https://secure.betwaypartnersafrica.com/imagehandler/a71e5297-9c4e-4b80-9a82-843895fe5759/" border="0" alt=""/>
          </a>
      `;
            liveMatchesWrapper.appendChild(adElement);
        } else if (index === 8) {
            // Insert ad at the end
            const endAdElement = document.createElement("div");
            endAdElement.classList.add(
                "flex",
                "justify-center",
                "items-center",
                "my-4",
                "swiper-slide"
            );
            endAdElement.innerHTML = `
        <a href="https://www.betway.com.ng/?btag=P105314-PR25154-CM79705-TS2010123" target="_blank" rel="nofollow">
            <img src="https://secure.betwaypartnersafrica.com/imagehandler/525c9174-9834-4a89-8083-7d203fbc5281/" border="0" alt=""/>
        </a>
      `;
            liveMatchesWrapper.appendChild(endAdElement);
        }
    });

}


function fetchRecentUpdates(date = null) {
    const dateInput = document.getElementById("date-input").value;
    const selectedDate = date || dateInput;
    const url = new URL("/api/recent-updates/", window.location.origin);
    if (selectedDate) {
        url.searchParams.append("date", selectedDate);
    }

    // Show loading icon
    document.getElementById("loading-icon").style.display = "inline-grid";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            renderRecentUpdates(data.matches);
            // Hide loading icon
            document.getElementById("loading-icon").style.display = "none";
            // Auto-scroll to recent-updates-container
            document
                .getElementById("recent-updates-container")
                .scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => console.error("Error fetching recent updates:", error));
    // Hide loading icon in case of error
    document.getElementById("loading-icon").style.display = "none";
}


function renderRecentUpdates(matches) {
  const container = document.getElementById("recent-updates-container");
  container.innerHTML = ""; // Clear any existing content

  matches.forEach((match, index) => {
    console.log(match);
    const isFullTime = match.match_status.short === "FT";
    const matchDateTime = new Date(match.match_date_time * 1000);
    const formattedDate = matchDateTime.toLocaleDateString();
    const formattedTime = matchDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const matchElement = document.createElement("div");
    matchElement.classList.add("bg-n30", "rounded-xl", "dark:bg-n900");
    
     matchElement.innerHTML = `
        <div class="flex justify-between items-center bg-n900 rounded-t-xl text-white p-5">
	
        <i class="ph-fill ph-star absolute -top-1 -right-6 text-o300"></i></a>
            <div class="flex justify-start items-center gap-4">
                <img src="${match.leagueLogo}" alt="" class="size-12" />
                <div>
		    <a href="/league-info/${match.leagueId}/" class="text-lg font-semibold relative">
	   	    ${match.leagueName}
		    </a>
                    <p class="pt-1">${match.group}</p>
                </div>
            </div>
            <a href="#">
                <i class="ph ph-caret-right text-2xl"></i>
            </a>
        </div>
        <div class="p-4 flex flex-col gap-4">
            <a href="/match-detail/${match.id}/" class="p-5 rounded-xl bg-white flex justify-between items-center gap-6 dark:bg-black">
                <div class="w-full">
                    <div class="flex justify-between items-center pb-4">
                        <div class="flex justify-start items-center gap-3">
                            <img src="${
                              match.team1Logo
                            }" class="size-10" alt="" />
                            <p class="text-sm relative font-semibold">
                                ${match.team1Name}
                                <i class="ph-fill ph-star absolute top-0 -right-5 text-o300"></i>
                            </p>
                        </div>
                        ${
                          isFullTime
                           ?`<p class="text-base font-semibold">${match.team1Score}</p>`
                            : `<p class="text-base font-semibold">${formattedTime}</p>`
                        }
                    </div>
                    <div class="border-t border-dashed border-n50 dark:border-blackN50">
                        ${
                          isFullTime
                           ?`<p class="text-sm font-semibold -mt-[10px] bg-white px-2 w-fit ml-10 dark:bg-black">${match.match_status.short}</p>`
                            : `<p class="text-sm font-semibold -mt-[10px] bg-white px-2 w-fit ml-10 dark:bg-black">${match.match_status.short}</p>`
                        }
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <div class="flex justify-start items-center gap-3">
                            <img src="${
                              match.team2Logo
                            }" class="size-10" alt="" />
                            <p class="text-sm relative font-semibold">${
                              match.team2Name
                            }</p>
                        </div>
                        ${
                          isFullTime
                           ?`<p class="text-base font-semibold">${match.team2Score}</p>`
                            : `<p class="text-base font-semibold">${formattedDate}</p>`
                        }
                    </div>
                </div>
                <button>
                    <i class="ph-fill ph-star text-o300 text-2xl"></i>
                </button>
            </a>
        </div>
    `;
    container.appendChild(matchElement);

    // Insert ad after the third match
    if (index === 2) {
      const adElement = document.createElement("div");
      adElement.classList.add("flex", "justify-center", "items-center", "my-4");
      adElement.innerHTML = `
          <a href="https://www.betway.com.ng/?btag=P105314-PR25154-CM79705-TS2010123" target="_blank" rel="nofollow">
              <img src="https://secure.betwaypartnersafrica.com/imagehandler/525c9174-9834-4a89-8083-7d203fbc5281/" border="0" alt="Ad 1"/>
          </a>
      `;
      container.appendChild(adElement);
    }
  });
}


function fetchLiveMatches2() {
  const url = new URL("/api/live-matches-all/", window.location.origin);

  // Show loading icon
  // document.getElementById("loading-icon").classList.remove("hidden");

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderLiveMatches2(data.matches);
      // Hide loading icon
      // document.getElementById("loading-icon").classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error fetching live matches:", error);
      // Hide loading icon in case of error
      // document.getElementById("loading-icon").classList.add("hidden");
    });
}



function renderLiveMatches2(matches) {
    const container = document.getElementById("live-matches-container");
    container.innerHTML = ""; // Clear any existing content

    matches.forEach((match) => {
        const matchElement = document.createElement("div");
        matchElement.classList.add(
            "bg-n900",
            "p-5",
            "rounded-2xl",
            "text-white",
            "swiper-slide",
            "dark:bg-blackN30",
            "relative"
        );
        matchElement.innerHTML = `
        <img src="${match.leagueLogo}" class="absolute top-0 bottom-0 left-0 -z-10" alt="" />
        <a href="/league-info/${match.leagueId}/" class="text-base font-semibold">${match.leagueName}</a>
        <p class="text-xs pt-1 pb-6">${match.group}</p>
        <div class="flex justify-center items-center w-full border-t border-dashed border-n500">
            <p class="bg-n900 -mt-3 w-fit px-2 dark:bg-blackN30">VS</p>
        </div>
        <div class="flex justify-between items-center pt-3">
            <a href="/match-detail/${match.id}/" class="flex justify-center items-center flex-col">
                <img src="${match.team1Logo}" alt="" width="100" />
                <p class="text-base font-semibold text-center pt-3">${match.team1Name}</p>
            </a>
            <div class="flex justify-center items-center flex-col gap-3">
                <p class="text-[30px] font-bold">${match.team1Score} : ${match.team2Score}</p>
                <p class="border border-p1 rounded-full text-sm text-p1 py-1 px-5">${match.elapsed}'</p>
            </div>
            <a href="/match-detail/${match.id}/" class="flex justify-center items-center flex-col">
                <img src="${match.team2Logo}" alt="" width="100" />
                <p class="text-base font-semibold text-center pt-3">${match.team2Name}</p>
            </a>
        </div>
    `;
        container.appendChild(matchElement);
    });
}

function fetchFinishedMatches() {
    const url = new URL("/api/recent-updates/", window.location.origin);

    // Show loading icon
    // document.getElementById("loading-icon").classList.remove("hidden");

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            renderFinishedMatches(data.matches);
            // Hide loading icon
            // document.getElementById("loading-icon").classList.add("hidden");
        })
        .catch((error) => {
            console.error("Error fetching finished matches:", error);
            // Hide loading icon in case of error
            // document.getElementById("loading-icon").classList.add("hidden");
        });
}

function renderFinishedMatches(matches) {
    const container = document.getElementById("finished-matches-container");
    container.innerHTML = ""; // Clear any existing content

    matches.forEach((match) => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("bg-n30", "rounded-xl", "dark:bg-blackN30");
        matchElement.innerHTML = `
	<img src="/static/images/trophy.png" class="absolute top-0 bottom-0 left-0 -z-10" alt="" />
        <div class="flex justify-between items-center bg-n900 rounded-t-xl text-white p-5 dark:bg-blackN30">
            <div class="flex justify-start items-center gap-4">
                <img src="${match.leagueLogo}" alt="" class="size-12" />
                <div>
		    <p class="text-lg font-semibold relative">
                    <a href="/league-info/${match.leagueId}/"> ${match.leagueName} 
                        <i class="ph-fill ph-star absolute -top-1 -right-6 text-o300"></i>
		    </a>
                    </p>
                    <p class="pt-1">${match.group}</p>
                </div>
            </div>
            <a href="#">
                <i class="ph ph-caret-right text-2xl"></i>
            </a>
        </div>
        <div class="p-4 flex flex-col gap-4">
            <a href="match-info.html" class="p-5 rounded-xl bg-white flex justify-between items-center gap-6 dark:bg-black">
                <div class="w-full">
                    <div class="flex justify-between items-center pb-4">
                        <div class="flex justify-start items-center gap-3">
                            <img src="${match.team1Logo}" class="size-10" alt="" />
                            <p class="text-sm relative font-semibold">
                                ${match.team1Name}
                                <i class="ph-fill ph-star absolute top-0 -right-5 text-o300"></i>
                            </p>
                        </div>
                        <p class="text-base font-semibold">${match.team1Score}</p>
                    </div>
                    <div class="border-t border-dashed border-n50 dark:border-blackN50">
                        <p class="text-sm font-semibold -mt-[10px] bg-white px-2 w-fit ml-10 dark:bg-black">FT</p>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <div class="flex justify-start items-center gap-3">
                            <img src="${match.team2Logo}" class="size-10" alt="" />
                            <p class="text-sm relative font-semibold">${match.team2Name}</p>
                        </div>
                        <p class="text-base font-semibold">${match.team2Score}</p>
                    </div>
                </div>
                <button>
                    <i class="ph ph-star text-o300 text-2xl"></i>
                </button>
            </a>
        </div>
    `;
        container.appendChild(matchElement);
    });
}




