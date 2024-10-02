"use strict";
document.addEventListener("DOMContentLoaded", function () {
  //ONBoarding slider Area
  const goToHomeButton = document.querySelector("#goToHomePage");
  const sliderSelect = document.querySelector(".bottom-steps-slider");
  const swiperNavButton = document.querySelector(".swiper-nav-button");
  const navButton = document.querySelector(".onboardingNavButton");

  //Onboarding slider
  let bottomStepsSlider = document.querySelectorAll(".bottom-steps-slider");
  bottomStepsSlider &&
    bottomStepsSlider.forEach(function (bottomStepsSlider) {
      var swiper = new Swiper(bottomStepsSlider, {
        slidesPerView: 1,
        slidesToShow: 1,
        paginationClickable: true,
        spaceBetween: 4,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: bottomStepsSlider.querySelector(".ara-next"),
          prevEl: bottomStepsSlider.querySelector(".ara-prev"),
        },
      });

      swiper.on("reachEnd", function () {
        swiperNavButton.classList.add("hidden");
        navButton.classList.remove("hidden");
      });
    });

  // Go To Home Page
  let count = 1;
  goToHomeButton &&
    goToHomeButton.addEventListener("click", () => {
      const totalSlider = sliderSelect.querySelectorAll(".swiper-slide");
      count++;
      if (count > totalSlider.length - 1) {
        swiperNavButton.classList.add("hidden");
        navButton.classList.remove("hidden");
      }
    });

  let liveScoreSlider = document.querySelectorAll(".live-score-carousel");
  liveScoreSlider &&
    liveScoreSlider.forEach(function (liveScoreSlider) {
      var swiper = new Swiper(liveScoreSlider, {
        loop: true,
        slidesPerView: 1.2,
        centeredSlides: true,
        slidesToShow: 1,
        spaceBetween: 12,
      });
    });
});
