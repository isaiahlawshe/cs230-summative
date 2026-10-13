// Campus Club Event Finder: sample data is kept in one JavaScript array.
const events = [
  { id: 1, name: "Intro to Python Night", organization: "Computer Science Club", date: "2026-10-15", time: "6:00 PM", location: "Eby Fieldhouse 104", category: "Academic", audience: "All students", cost: 0, rsvps: 32 },
  { id: 2, name: "Pumpkin Painting Social", organization: "Campus Activities Board", date: "2026-10-16", time: "7:00 PM", location: "Clark Alumni House", category: "Social", audience: "All students", cost: 4, rsvps: 48 },
  { id: 3, name: "Resume Review Drop-In", organization: "Career Services", date: "2026-10-17", time: "11:00 AM", location: "Gage Memorial Union", category: "Career", audience: "Juniors and seniors", cost: 0, rsvps: 21 },
  { id: 4, name: "Open Mic and Coffee", organization: "Literary Society", date: "2026-10-18", time: "7:30 PM", location: "The Brew", category: "Arts", audience: "All students", cost: 3, rsvps: 26 },
  { id: 5, name: "Campus Garden Cleanup", organization: "Green Coe", date: "2026-10-20", time: "3:30 PM", location: "Campus garden", category: "Service", audience: "Volunteers", cost: 0, rsvps: 17 },
  { id: 6, name: "Pickup Volleyball", organization: "Intramural Sports", date: "2026-10-21", time: "5:00 PM", location: "Knutson Center", category: "Sports", audience: "All skill levels", cost: 0, rsvps: 29 },
  { id: 7, name: "Internship Q&A Panel", organization: "Business Club", date: "2026-10-22", time: "6:30 PM", location: "Eby Hall 201", category: "Career", audience: "All students", cost: 0, rsvps: 41 },
  { id: 8, name: "Board Game Café", organization: "Tabletop Club", date: "2026-10-23", time: "7:00 PM", location: "Lower Gage", category: "Social", audience: "All students", cost: 5, rsvps: 35 },
  { id: 9, name: "Watercolor Workshop", organization: "Art Club", date: "2026-10-24", time: "1:00 PM", location: "Dows Fine Arts Center", category: "Arts", audience: "Beginners welcome", cost: 6, rsvps: 19 },
  { id: 10, name: "Study Skills Sprint", organization: "Academic Success Center", date: "2026-10-26", time: "4:00 PM", location: "Library 2nd floor", category: "Academic", audience: "All students", cost: 0, rsvps: 14 },
  { id: 11, name: "5K Fun Run", organization: "Running Club", date: "2026-10-28", time: "5:30 PM", location: "Campus track", category: "Sports", audience: "All fitness levels", cost: 2, rsvps: 37 },
  { id: 12, name: "Volunteer Letter-Writing", organization: "Community Partners", date: "2026-10-29", time: "6:00 PM", location: "Gage Memorial Union 2", category: "Service", audience: "Volunteers", cost: 0, rsvps: 12 }
];

const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const dateFilter = document.querySelector("#date-filter");
const sortSelect = document.querySelector("#sort-select");
const freeFilter = document.querySelector("#free-filter");
const eventList = document.querySelector("#event-list");
const emptyMessage = document.querySelector("#empty-message");
const resultsMessage = document.querySelector("#results-message");

const formatDate = (dateString) => new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
  weekday: "short", month: "short", day: "numeric"
});
const formatMoney = (amount) => amount === 0 ? "Free" : `$${amount.toFixed(2)}`;

// filter() selects matching events without changing the original dataset.
const getFilteredEvents = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const startDate = dateFilter.value;
  const freeOnly = freeFilter.checked;

  const matchingEvents = events.filter((event) => {
    const searchableText = `${event.name} ${event.organization} ${event.category} ${event.location}`.toLowerCase();
    return searchableText.includes(searchTerm)
      && (category === "all" || event.category === category)
      && (!startDate || event.date >= startDate)
      && (!freeOnly || event.cost === 0);
  });

  // Sort a copied array so the original event data remains unchanged.
  const sorters = {
    date: (a, b) => a.date.localeCompare(b.date),
    name: (a, b) => a.name.localeCompare(b.name),
    "cost-low": (a, b) => a.cost - b.cost || a.date.localeCompare(b.date),
    rsvps: (a, b) => b.rsvps - a.rsvps
  };
  return [...matchingEvents].sort(sorters[sortSelect.value]);
};

const renderEvents = (eventData) => {
  // map() converts each event object into a card in the page.
  eventList.innerHTML = eventData.map((event) => `

<article class="event-card"
         data-event-id="${event.id}"
         tabindex="0"
         role="button"
         aria-label="View details for ${event.name}">
  <div class="card-top">
    <span class="category-pill">${event.category}</span>
    <span class="cost-pill ${event.cost === 0 ? "free" : "paid"}">
      ${formatMoney(event.cost)}
    </span>
  </div>
  <h3>${event.name}</h3>
  <p class="organization">${event.organization}</p>
  <div class="event-details">
    <span>▦ <b>${formatDate(event.date)} · ${event.time}</b></span>
    <span>⌖ ${event.location}</span>
    <span>♡ ${event.rsvps + (rsvpedEvents.has(event.id) ? 1 : 0)} RSVPs</span>
  </div>
  <p class="audience">For: ${event.audience}</p>
  <p class="audience">Click to view details →</p>
</article>
`).join("");

  emptyMessage.hidden = eventData.length !== 0;
  resultsMessage.textContent = `${eventData.length} of ${events.length} events`;
};

const updateSummary = (eventData) => {
  // reduce() aggregates values for the summary cards.
  const freeCount = eventData.reduce((total, event) => total + (event.cost === 0 ? 1 : 0), 0);
  const totalCost = eventData.reduce((total, event) => total + event.cost, 0);
  const totalRsvps = eventData.reduce((total, event) => total + event.rsvps, 0);
  const averageCost = eventData.length ? totalCost / eventData.length : 0;

  document.querySelector("#event-count").textContent = eventData.length;
  document.querySelector("#free-count").textContent = freeCount;
  document.querySelector("#average-cost").textContent = `$${averageCost.toFixed(2)}`;
  document.querySelector("#total-rsvps").textContent = totalRsvps;
};

const updatePage = () => {
  const visibleEvents = getFilteredEvents();
  renderEvents(visibleEvents);
  updateSummary(visibleEvents);
};

[searchInput, categoryFilter, dateFilter, sortSelect, freeFilter].forEach((input) => {
  input.addEventListener("input", updatePage);
  input.addEventListener("change", updatePage);
});

document.querySelector("#reset-button").addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  dateFilter.value = "";
  sortSelect.value = "date";
  freeFilter.checked = false;
  updatePage();
});


const savedRSVPs = JSON.parse(
  localStorage.getItem("campus-club-rsvps") || "[]"
);

const rsvpedEvents = new Set(savedRSVPs);
let selectedEventId = null;

const saveRSVPs = () => {
  localStorage.setItem(
    "campus-club-rsvps",
    JSON.stringify([...rsvpedEvents])
  );
};


updatePage();
