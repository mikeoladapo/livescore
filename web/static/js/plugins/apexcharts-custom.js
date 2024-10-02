let isDark = localStorage.getItem("mode") === "dark";
if (document.querySelector(".player-profile-chart")) {
  var options = {
    series: [
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    chart: {
      height: 310,
      type: "radar",
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
    },
    stroke: {
      width: 2,
    },
    colors: ["#FF4560"],
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "Attack",
        "Tactic",
        "Defence",
        "Skills",
        "Midfield",
        "Corner",
      ],
    },
    yaxis: {
      show: false,
    },
    // tooltip: {
    //   theme: isDark ? "dark" : "light",
    // },
  };

  chart = new ApexCharts(
    document.querySelector(".player-profile-chart"),
    options
  );
  chart.render();
}
