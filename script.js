(() => {
  "use strict";

  // The navigation stays usable without JavaScript on desktop.
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");
  const closeNavigation = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      closeNavigation();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeNavigation();
  });
  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", closeNavigation);

  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          sectionLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sectionLinks.forEach((link) =>
      observer.observe(document.querySelector(link.getAttribute("href"))),
    );
  }

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const gearInputs = [...document.querySelectorAll("[data-gear]")];
  const updateCount = () => {
    const panel = document.querySelector('[role="tabpanel"]:not([hidden])');
    const inputs = [...panel.querySelectorAll("input")];
    document.querySelector("#checklist-count").textContent =
      `${inputs.filter((input) => input.checked).length} of ${inputs.length} packed`;
  };
  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !active;
    });
    updateCount();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft")
        next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      event.preventDefault();
      activateTab(next);
      next.focus();
    });
  });
  let savedGear = {};
  let storageAvailable = true;
  try {
    savedGear =
      JSON.parse(localStorage.getItem("roy-lacrosse-2027-gear")) || {};
  } catch {
    storageAvailable = false;
  }
  if (!savedGear || typeof savedGear !== "object" || Array.isArray(savedGear))
    savedGear = {};
  const describeStorage = () => {
    if (!storageAvailable)
      document.querySelector(".checklist-help").textContent =
        "Check items off as you go. This browser can’t save your list between visits.";
  };
  gearInputs.forEach((input) => {
    input.checked = savedGear[input.dataset.gear] === true;
    input.addEventListener("change", () => {
      savedGear[input.dataset.gear] = input.checked;
      try {
        localStorage.setItem(
          "roy-lacrosse-2027-gear",
          JSON.stringify(savedGear),
        );
      } catch {
        storageAvailable = false;
        describeStorage();
      }
      updateCount();
    });
  });
  describeStorage();
  updateCount();

  // All-day events keep the supplied season dates consistent in any time zone.
  const seasonEvents = [
    [
      "20261123",
      "Player & Coach Registration Opens (Early Bird)",
      "Register at https://www.imlaxutah.org and select Roy Youth. Early Bird pricing ends December 31, 2026.",
    ],
    [
      "20270125",
      "Boys Gear Rental Registration Opens",
      "$85.00 full set via IMLAX. https://www.imlaxutah.org/gear-rental",
    ],
    [
      "20270201",
      "Scholarship Applications Due & Late Registration Begins",
      "Apply through https://www.imlaxutah.org. Late registration includes a $25 fee.",
    ],
    [
      "20270210",
      "Last Day to Register for Youth Spring Season",
      "Final registration deadline. https://www.imlaxutah.org",
    ],
    [
      "20270224",
      "Practices Permitted to Begin",
      "Typically 2 practices/week at local Roy fields. Confirm your team practice details with your coach.",
    ],
    [
      "20270312",
      "Game Schedules Issued to Coaches",
      "Posted online the following Monday.",
    ],
    [
      "20270319",
      "Official Rosters & Jersey Numbers Set",
      "Available on the IMLAX website.",
    ],
    [
      "20270320",
      "Youth Saturday Games Begin",
      "Weekday games may begin as early as April 12, 2027.",
    ],
    [
      "20270515",
      "LAX FEST — Last Day of Regular Games for 5th–8th Grade",
      "Last day of regular games for 5th–8th grade divisions.",
    ],
    [
      "20270518",
      "IMLAX Boys Championship Games",
      "5th–8th A&B Divisions @ Westminster College.",
    ],
    [
      "20270520",
      "IMLAX Girls Championship Games",
      "5th–8th A&B Divisions @ Westminster College.",
    ],
    ["20270522", "Last Day of Games for K–4th Grade Divisions", "Go Royals!"],
  ];
  const escapeCalendar = (value) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  const nextDay = (date) => {
    const day = new Date(
      Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8) + 1),
    );
    return day.toISOString().slice(0, 10).replace(/-/g, "");
  };
  // RFC 5545 folds content lines at 75 octets, including non-ASCII titles.
  const foldLine = (line) => {
    const encoder = new TextEncoder();
    let result = "",
      count = 0;
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (count + size > 75) {
        result += "\r\n ";
        count = 1;
      }
      result += character;
      count += size;
    }
    return result;
  };
  document.querySelector("#download-calendar").addEventListener("click", () => {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Roy Youth Lacrosse//2027 Spring Season//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Roy Youth Lacrosse — Spring 2027",
    ];
    seasonEvents.forEach(([date, title, description]) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:roy-youth-2027-${date}@royyouthlacrosse.local`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${nextDay(date)}`,
        `SUMMARY:${escapeCalendar(title)}`,
        `DESCRIPTION:${escapeCalendar(description)}`,
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.map(foldLine).join("\r\n") + "\r\n"], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Roy-Youth-Lacrosse-Spring-2027.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#calendar-status").textContent =
      "Season calendar downloaded. Open the .ics file in your calendar app to import all 12 dates.";
  });
})();
