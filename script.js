// ══════════════════════════════════════════════
//  script.js — Rental Contract Helper, Phase 1
//  No backend. All data lives here until Phase 2.
// ══════════════════════════════════════════════

// ── Building data ─────────────────────────────────────────────────────────
// To add a building: copy one block and change the values.
// To add a photo:    set image to a filename, e.g. "photos/sunrise.jpg"
//                    Leave "" to use the emoji instead.

const BUILDINGS = [
    {
        id: 1,
        name: "Sunrise Apartments",
        address: "142 Oak Street, Downtown",
        type: "Apartment",
        image: "",
        emoji: "🌅",
        monthlyRent: 1200,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 850,
        available: true,
        amenities: ["Parking", "Gym", "Laundry", "Air Conditioning", "Storage Unit"],
        description: "A well-maintained complex in the heart of downtown. Close to public transport and major shopping. Management is responsive and the community is quiet — a solid first choice for new renters.",
        reviews: [
            { stars: 5, date: "Mar 2025", text: "Great location, responsive landlord. Heating works perfectly all winter." },
            { stars: 4, date: "Jan 2025", text: "Nice building overall. A bit pricey but worth it for the amenities." },
            { stars: 3, date: "Nov 2024", text: "Maintenance can be slow on weekends, but they do fix things eventually." }
        ]
    },
    {
        id: 2,
        name: "Greenview Tower",
        address: "78 Elm Avenue, Midtown",
        type: "Condo",
        image: "",
        emoji: "🏢",
        monthlyRent: 1800,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
        available: true,
        amenities: ["24/7 Concierge", "Rooftop Terrace", "Pool", "Gym", "Underground Parking"],
        description: "Modern high-rise with panoramic city views and upscale finishes. Ideal for professionals. Note: the elevator had ongoing maintenance issues in 2024 — worth asking management about current status.",
        reviews: [
            { stars: 2, date: "Feb 2025", text: "Landlord ignored multiple requests about the broken elevator for weeks." },
            { stars: 4, date: "Dec 2024", text: "Great views and modern interiors. Street noise can be an issue at night." },
            { stars: 4, date: "Oct 2024", text: "Generally a good place. Management improved a lot in the past year." }
        ]
    },
    {
        id: 3,
        name: "Lakeside Studios",
        address: "9 Lakeview Road, West End",
        type: "Studio",
        image: "",
        emoji: "🏡",
        monthlyRent: 900,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 480,
        available: false,
        amenities: ["Lake View", "Pet Friendly", "Bike Storage", "Laundry", "Garden Access"],
        description: "Cosy studios with stunning lake views. Perfect for students or solo professionals. The landlord is highly responsive and tenants consistently praise the peaceful atmosphere.",
        reviews: [
            { stars: 5, date: "Apr 2025", text: "Best landlord I have ever had. Issues fixed same day. Highly recommend." },
            { stars: 5, date: "Feb 2025", text: "Super quiet, beautiful views, management genuinely cares about tenants." }
        ]
    },
    {
        id: 4,
        name: "Heritage Flats",
        address: "33 Maple Lane, Old Town",
        type: "Apartment",
        image: "",
        emoji: "🏛️",
        monthlyRent: 1050,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 720,
        available: true,
        amenities: ["Historic Building", "Shared Garden", "Hardwood Floors", "High Ceilings"],
        description: "Charming apartments inside a restored 1920s heritage building. High ceilings, original hardwood floors, and a shared garden. Some units have older plumbing — always ask before signing.",
        reviews: [
            { stars: 4, date: "Mar 2025", text: "Beautiful building. The character is unmatched. Old heating but it works fine." },
            { stars: 3, date: "Jan 2025", text: "Lovely place but the pipes are noisy at night. Management was responsive when I raised it." }
        ]
    }
];

// User-submitted reviews — stored in memory for Phase 1
const userReviews = {};

// Deadlines list — stored in memory for Phase 1
let deadlines = [];
let deadlineIdCounter = 0;

// Currently open building id
let currentId = null;


// ── PAGE NAVIGATION ───────────────────────────────────────────────────────

function goTo(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    window.scrollTo(0, 0);
}

function goBack() {
    goTo("page-dashboard");
}


// ── LEGAL TERM TRANSLATOR ─────────────────────────────────────────────────

const LEGAL_TERMS = {
    "indemnification": "This clause means you agree to protect the landlord from financial loss caused by your actions. For example, if a guest is injured in your apartment and sues, you — not the landlord — would be responsible for covering those costs.",
    "subrogation": "If your insurance company pays out for a loss (such as a flood), this clause allows them to sue the responsible party on your behalf to recover that money. It prevents you from claiming insurance and also suing the same party separately.",
    "force majeure": "A 'no blame' clause that excuses either party from fulfilling their obligations if an extraordinary and unforeseeable event occurs — such as a natural disaster, pandemic, or government-ordered shutdown.",
    "lien": "A legal claim or hold placed on a property. If the building carries a lien, a third party — such as a bank or contractor — has an outstanding financial stake in it. This could affect your tenancy if the landlord defaults on payments.",
    "latent defect": "A hidden flaw in the property that was not visible during a standard inspection — for example, mold behind walls, faulty electrical wiring, or structural damage. If the landlord knew about it and did not disclose it, you may have legal grounds for compensation.",
    "habitability": "Your legal right to a safe, clean, and livable home. Landlords are legally required to maintain working plumbing, heating, structural integrity, and pest control. If they fail to do so, you may be entitled to withhold rent or terminate the lease depending on local law.",
    "subletting": "Renting your unit to another person while you remain the primary tenant on the lease. Many contracts either forbid this entirely or require the landlord's written approval before you may do so.",
    "default": "When one party fails to meet a legal obligation under the contract — most commonly the tenant not paying rent on time. Default can trigger late fees, penalty clauses, or eviction proceedings depending on the terms.",
    "easement": "A legal right that allows a third party to use a specific portion of the rented property for a defined purpose — such as a utility company accessing pipes through a shared corridor.",
    "escrow": "Money held by a neutral third party — often a bank — until a specific condition is met. Security deposits are sometimes held in escrow to protect both the tenant and the landlord from disputes."
};

function quickTerm(term) {
    document.getElementById("legalInput").value = term;
    explainTerm();
}

function explainTerm() {
    const raw  = document.getElementById("legalInput").value.trim().toLowerCase();
    const box  = document.getElementById("legalResult");
    const text = document.getElementById("legalText");

    if (!raw) { shake(document.getElementById("legalInput")); return; }

    const match = Object.keys(LEGAL_TERMS).find(k => raw.includes(k));
    text.textContent = match
        ? LEGAL_TERMS[match]
        : "This term is not in our current dictionary. In Phase 2, this will query a live legal database. For now, try one of the quick-pick tags above.";

    box.classList.remove("hidden");
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// ── TENANT RIGHTS PANEL ───────────────────────────────────────────────────

function toggleRights() {
    const list    = document.getElementById("rightsList");
    const chevron = document.getElementById("rightsChevron");
    const isHidden = list.classList.contains("hidden");
    list.classList.toggle("hidden", !isHidden);
    chevron.classList.toggle("open", isHidden);
}


// ── RENT GROWTH CALCULATOR + BUDGET EVALUATOR ─────────────────────────────

function calculateRent() {
    const initial = parseFloat(document.getElementById("initialRent").value);
    const rate    = parseFloat(document.getElementById("increaseRate").value);
    const months  = parseInt(document.getElementById("months").value);
    const budget  = parseFloat(document.getElementById("userBudget").value) || null;

    if (!initial || initial <= 0 || isNaN(rate) || !months || months < 1) {
        alert("Please fill in the first three fields with valid numbers."); return;
    }
    if (initial > 1000000 || rate > 100 || months > 600) {
        alert("Please use realistic values: rent ≤ $1,000,000  ·  rate ≤ 100%  ·  months ≤ 600."); return;
    }

    const { total, finalRent, rows } = projectRent(initial, rate, months);
    const pct = (((finalRent - initial) / initial) * 100).toFixed(1);

    // Budget alert
    const alertEl = document.getElementById("budgetAlert");
    if (budget && budget > 0) {
        if (total > budget) {
            const over = total - budget;
            alertEl.className = "budget-alert over";
            alertEl.innerHTML = `<span class="alert-icon">⚠️</span>
                <span>Your projected total of <strong>$${fmt(total)}</strong> exceeds your budget by <strong>$${fmt(over)}</strong>. See below for how long you can afford this rent.</span>`;
            alertEl.classList.remove("hidden");
        } else {
            const under = budget - total;
            alertEl.className = "budget-alert ok";
            alertEl.innerHTML = `<span class="alert-icon">✅</span>
                <span>This rent fits your budget. You will have <strong>$${fmt(under)}</strong> to spare over the full term.</span>`;
            alertEl.classList.remove("hidden");
        }
    } else {
        alertEl.classList.add("hidden");
    }

    // Stats pills
    document.getElementById("rentStats").innerHTML = `
        <div class="stat-pill"><span class="stat-val">$${fmt(total)}</span><span class="stat-key">Total Cost</span></div>
        <div class="stat-pill"><span class="stat-val">$${fmt(finalRent)}</span><span class="stat-key">Final Monthly</span></div>
        <div class="stat-pill"><span class="stat-val">+${pct}%</span><span class="stat-key">Total Increase</span></div>
    `;

    // Feasible duration
    const feasibleEl = document.getElementById("feasibleRow");
    if (budget && budget > 0 && total > budget) {
        const maxMonths = feasibleDuration(initial, rate, budget);
        feasibleEl.innerHTML = `⏱️ With your budget of <strong>$${fmt(budget)}</strong>, you can afford this rent for a maximum of <strong>${maxMonths} month${maxMonths !== 1 ? "s" : ""}</strong> (${(maxMonths / 12).toFixed(1)} years).`;
        feasibleEl.classList.remove("hidden");
    } else {
        feasibleEl.classList.add("hidden");
    }

    // Breakdown table
    document.getElementById("rentBreakdown").innerHTML = buildTable(rows);

    const box = document.getElementById("rentResult");
    box.classList.remove("hidden");
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// ── QUICK CALC (building detail page) ────────────────────────────────────

function quickCalc() {
    const building = BUILDINGS.find(b => b.id === currentId);
    if (!building) return;

    const rate   = parseFloat(document.getElementById("quickRate").value);
    const months = parseInt(document.getElementById("quickMonths").value);
    const budget = parseFloat(document.getElementById("quickBudget").value) || null;

    if (isNaN(rate) || !months || months < 1) {
        alert("Please fill in the rate and duration fields."); return;
    }

    const initial = building.monthlyRent;
    const { total, finalRent, rows } = projectRent(initial, rate, months);
    const pct = (((finalRent - initial) / initial) * 100).toFixed(1);

    // Budget alert
    const alertEl = document.getElementById("quickBudgetAlert");
    if (budget && budget > 0) {
        if (total > budget) {
            const over = total - budget;
            alertEl.className = "budget-alert over";
            alertEl.innerHTML = `<span class="alert-icon">⚠️</span>
                <span>Total <strong>$${fmt(total)}</strong> exceeds your budget by <strong>$${fmt(over)}</strong>.</span>`;
            alertEl.classList.remove("hidden");
        } else {
            alertEl.className = "budget-alert ok";
            alertEl.innerHTML = `<span class="alert-icon">✅</span>
                <span>This rent fits your budget — <strong>$${fmt(budget - total)}</strong> to spare.</span>`;
            alertEl.classList.remove("hidden");
        }
    } else {
        alertEl.classList.add("hidden");
    }

    document.getElementById("quickResultText").innerHTML = `
        <div class="rent-stats" style="margin-bottom:0">
            <div class="stat-pill"><span class="stat-val">$${fmt(total)}</span><span class="stat-key">Total Cost</span></div>
            <div class="stat-pill"><span class="stat-val">$${fmt(finalRent)}</span><span class="stat-key">Final Monthly</span></div>
            <div class="stat-pill"><span class="stat-val">+${pct}%</span><span class="stat-key">Increase</span></div>
        </div>
    `;

    // Feasible duration
    const feasibleEl = document.getElementById("quickFeasibleRow");
    if (budget && budget > 0 && total > budget) {
        const maxMonths = feasibleDuration(initial, rate, budget);
        feasibleEl.innerHTML = `⏱️ Max affordable duration: <strong>${maxMonths} month${maxMonths !== 1 ? "s" : ""}</strong> (${(maxMonths / 12).toFixed(1)} yrs)`;
        feasibleEl.classList.remove("hidden");
    } else {
        feasibleEl.classList.add("hidden");
    }

    document.getElementById("quickResult").classList.remove("hidden");
}


// ── SHARED RENT CALCULATION HELPERS ──────────────────────────────────────

// Core projection engine — mirrors the C++ logic from the report
function projectRent(initial, rate, months) {
    let total = 0, rent = initial, rows = [];

    for (let m = 1; m <= months; m++) {
        // Apply annual increase at the start of each new year (after month 12, 24…)
        if (m > 1 && (m - 1) % 12 === 0) rent *= (1 + rate / 100);
        total += rent;

        // Collect a snapshot at the end of each year and at the final month
        if (m % 12 === 0 || m === months) {
            rows.push({
                label: m % 12 === 0 ? "Year " + (m / 12) : "Month " + m + " (partial)",
                rent,
                total
            });
        }
    }

    return { total, finalRent: rent, rows };
}

// Feasible duration — mirrors valid_years() from the report
// Returns the maximum number of months affordable within a given budget
function feasibleDuration(initial, rate, budget) {
    let total = 0, rent = initial, months = 0;

    while (true) {
        months++;
        if (months > 1 && (months - 1) % 12 === 0) rent *= (1 + rate / 100);
        total += rent;
        if (total > budget || months >= 600) break;
    }

    // Step back one — the month that pushed us over is not affordable
    return Math.max(0, months - 1);
}

function buildTable(rows) {
    let tbl = `<table class="breakdown-table">
        <thead><tr><th>Period</th><th>Monthly Rent</th><th>Cumulative Total</th></tr></thead>
        <tbody>`;
    rows.forEach(r => {
        tbl += `<tr><td>${r.label}</td><td>$${fmt(r.rent)}</td><td>$${fmt(r.total)}</td></tr>`;
    });
    tbl += "</tbody></table>";
    return tbl;
}

function fmt(n) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


// ── DEADLINE & RENEWAL TRACKER ────────────────────────────────────────────

const DEADLINE_ICONS = {
    renewal:    "🔄",
    payment:    "💳",
    inspection: "🔍",
    notice:     "📨",
    other:      "📌"
};

function addDeadline() {
    const label = document.getElementById("deadlineLabel").value.trim();
    const date  = document.getElementById("deadlineDate").value;
    const type  = document.getElementById("deadlineType").value;

    if (!label) { shake(document.getElementById("deadlineLabel")); return; }
    if (!date)  { shake(document.getElementById("deadlineDate"));  return; }

    deadlines.push({ id: ++deadlineIdCounter, label, date, type });

    // Sort by date ascending
    deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Reset form
    document.getElementById("deadlineLabel").value = "";
    document.getElementById("deadlineDate").value  = "";

    renderDeadlines();
}

function removeDeadline(id) {
    deadlines = deadlines.filter(d => d.id !== id);
    renderDeadlines();
}

function renderDeadlines() {
    const list = document.getElementById("trackerList");

    if (!deadlines.length) {
        list.innerHTML = `<p class="tracker-empty">No deadlines yet — add one to get started</p>`;
        return;
    }

    list.innerHTML = deadlines.map(d => {
        const today     = new Date(); today.setHours(0,0,0,0);
        const target    = new Date(d.date + "T00:00:00");
        const diffMs    = target - today;
        const diffDays  = Math.round(diffMs / (1000 * 60 * 60 * 24));

        let urgencyClass, countdownClass, countdownText;

        if (diffDays < 0) {
            urgencyClass   = "past";
            countdownClass = "countdown-past";
            countdownText  = `${Math.abs(diffDays)}d ago`;
        } else if (diffDays <= 7) {
            urgencyClass   = "urgent";
            countdownClass = "countdown-urgent";
            countdownText  = diffDays === 0 ? "Today!" : `${diffDays}d left`;
        } else if (diffDays <= 30) {
            urgencyClass   = "soon";
            countdownClass = "countdown-soon";
            countdownText  = `${diffDays}d left`;
        } else {
            urgencyClass   = "future";
            countdownClass = "countdown-future";
            // Show in weeks or months for distant dates
            if (diffDays >= 60) {
                const months = Math.round(diffDays / 30);
                countdownText = `~${months}mo`;
            } else {
                const weeks = Math.round(diffDays / 7);
                countdownText = `~${weeks}wk`;
            }
        }

        const formattedDate = target.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const icon = DEADLINE_ICONS[d.type] || "📌";

        return `
        <div class="deadline-item ${urgencyClass}">
            <span class="deadline-type-icon">${icon}</span>
            <div class="deadline-info">
                <p class="deadline-label">${esc(d.label)}</p>
                <p class="deadline-date">${formattedDate}</p>
            </div>
            <span class="deadline-countdown ${countdownClass}">${countdownText}</span>
            <button class="deadline-delete" onclick="removeDeadline(${d.id})" title="Remove">✕</button>
        </div>`;
    }).join("");
}


// ── BUILDING SEARCH ───────────────────────────────────────────────────────

function searchBuilding() {
    const q    = document.getElementById("buildingInput").value.trim().toLowerCase();
    const grid = document.getElementById("buildingsGrid");

    if (!q) { shake(document.getElementById("buildingInput")); return; }

    const results = BUILDINGS.filter(b =>
        b.name.toLowerCase().includes(q)    ||
        b.address.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
    );

    if (!results.length) {
        grid.innerHTML = `<p class="placeholder-text">😕 No results for "<strong>${esc(q)}</strong>". Try "Sunrise", "Tower", "Studio", or "Heritage".</p>`;
        return;
    }

    grid.innerHTML = results.map(b => {
        const all = allReviews(b.id);
        const avg = avgRating(all);
        const img = b.image ? `<img src="${esc(b.image)}" alt="">` : b.emoji;
        const avail = b.available
            ? `<span class="badge badge-yes">Available</span>`
            : `<span class="badge badge-no">Unavailable</span>`;

        return `
        <div class="building-card" onclick="openBuilding(${b.id})">
            <div class="building-card-img">${img}</div>
            <div class="building-card-body">
                <p class="building-card-name">${esc(b.name)}</p>
                <p class="building-card-address">📍 ${esc(b.address)}</p>
                <div class="building-card-footer">
                    <span>
                        ${starHTML(avg)}
                        <span class="review-count-sm"> ${avg > 0 ? avg.toFixed(1) : "—"} (${all.length})</span>
                    </span>
                    ${avail}
                </div>
            </div>
        </div>`;
    }).join("");
}


// ── BUILDING DETAIL PAGE ──────────────────────────────────────────────────

function openBuilding(id) {
    const b = BUILDINGS.find(x => x.id === id);
    if (!b) return;
    currentId = id;

    const all = allReviews(id);
    const avg = avgRating(all);

    // Image
    document.getElementById("bHeroImg").innerHTML = b.image
        ? `<img src="${esc(b.image)}" alt="${esc(b.name)}">`
        : b.emoji;

    // Badges
    const availBadge = b.available
        ? `<span class="badge badge-yes">✓ Available</span>`
        : `<span class="badge badge-no">✗ Unavailable</span>`;
    document.getElementById("bBadges").innerHTML =
        `<span class="badge badge-type">${esc(b.type)}</span>${availBadge}`;

    // Info
    document.getElementById("bName").textContent    = b.name;
    document.getElementById("bAddress").textContent = "📍 " + b.address;
    document.getElementById("bDesc").textContent    = b.description;

    // Rating
    document.getElementById("bRatingRow").innerHTML = avg > 0
        ? `<span class="b-rating-num">${avg.toFixed(1)}</span>
           <span class="b-rating-stars" style="color:#f59e0b">${starHTML(avg)}</span>
           <span class="b-rating-count">${all.length} review${all.length !== 1 ? "s" : ""}</span>`
        : `<span class="b-rating-count">No reviews yet</span>`;

    // Stats strip
    document.getElementById("bStatsStrip").innerHTML = `
        <div class="stat-chip">
            <span class="chip-val">$${b.monthlyRent.toLocaleString()}<small style="font-size:0.65rem;font-weight:400">/mo</small></span>
            <span class="chip-key">Monthly Rent</span>
        </div>
        <div class="stat-chip">
            <span class="chip-val">${b.bedrooms} bed · ${b.bathrooms} bath</span>
            <span class="chip-key">Rooms</span>
        </div>
        <div class="stat-chip">
            <span class="chip-val">${b.sqft.toLocaleString()} sq ft</span>
            <span class="chip-key">Size</span>
        </div>
        <div class="stat-chip">
            <span class="chip-val">${esc(b.type)}</span>
            <span class="chip-key">Property Type</span>
        </div>
    `;

    // Amenities
    document.getElementById("bAmenities").innerHTML =
        b.amenities.map(a => `<span class="amenity-tag">${esc(a)}</span>`).join("");

    // Reviews
    renderReviews(all);

    // Reset review form
    document.getElementById("reviewText").value       = "";
    document.getElementById("ratingValue").value      = "0";
    document.getElementById("submitNote").textContent = "";
    document.querySelectorAll("#starRating .star").forEach(s => s.classList.remove("active"));

    // Reset quick calculator
    document.getElementById("quickRate").value   = "";
    document.getElementById("quickMonths").value = "";
    document.getElementById("quickBudget").value = "";
    document.getElementById("quickResult").classList.add("hidden");

    initStars();
    goTo("page-building");
}

function renderReviews(all) {
    document.getElementById("bReviewPill").textContent = all.length;
    document.getElementById("bReviewsList").innerHTML = all.length
        ? all.map(r => `
            <div class="review-item">
                <div class="review-item-header">
                    <span style="color:#f59e0b;font-size:0.92rem">${starHTML(r.stars)}</span>
                    <span class="review-date">${r.date || "Anonymous"}</span>
                </div>
                <p class="review-text">${esc(r.text)}</p>
            </div>`).join("")
        : `<p class="no-reviews">No reviews yet — be the first to share your experience!</p>`;
}

function submitReview() {
    const rating = parseInt(document.getElementById("ratingValue").value);
    const text   = document.getElementById("reviewText").value.trim();
    const note   = document.getElementById("submitNote");

    if (!rating) { note.style.color = "#dc2626"; note.textContent = "Please select a star rating first."; return; }
    if (!text)   { note.style.color = "#dc2626"; note.textContent = "Please write a short review."; return; }

    const now = new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
    if (!userReviews[currentId]) userReviews[currentId] = [];
    userReviews[currentId].push({ stars: rating, date: now, text });

    const all = allReviews(currentId);
    const avg = avgRating(all);

    // Update rating row
    document.getElementById("bRatingRow").innerHTML = `
        <span class="b-rating-num">${avg.toFixed(1)}</span>
        <span class="b-rating-stars" style="color:#f59e0b">${starHTML(avg)}</span>
        <span class="b-rating-count">${all.length} review${all.length !== 1 ? "s" : ""}</span>`;

    renderReviews(all);

    // Reset form
    document.getElementById("reviewText").value  = "";
    document.getElementById("ratingValue").value = "0";
    document.querySelectorAll("#starRating .star").forEach(s => s.classList.remove("active"));
    note.style.color   = "#0f766e";
    note.textContent   = "✓ Review submitted — thank you!";
}


// ── STAR RATING WIDGET ────────────────────────────────────────────────────

function initStars() {
    const stars = document.querySelectorAll("#starRating .star");
    const input = document.getElementById("ratingValue");

    stars.forEach(star => {
        star.addEventListener("mouseover", () => {
            const v = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.toggle("active", parseInt(s.dataset.val) <= v));
        });
        star.addEventListener("mouseout", () => {
            const sel = parseInt(input.value);
            stars.forEach(s => s.classList.toggle("active", parseInt(s.dataset.val) <= sel));
        });
        star.addEventListener("click", () => {
            input.value = star.dataset.val;
            const sel   = parseInt(input.value);
            stars.forEach(s => s.classList.toggle("active", parseInt(s.dataset.val) <= sel));
        });
    });
}


// ── HELPERS ───────────────────────────────────────────────────────────────

function allReviews(id) {
    const b = BUILDINGS.find(x => x.id === id);
    return [...(b ? b.reviews : []), ...(userReviews[id] || [])];
}

function avgRating(reviews) {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
}

function starHTML(rating) {
    let h = "";
    for (let i = 1; i <= 5; i++)
        h += `<span style="color:${i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}">★</span>`;
    return h;
}

function esc(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shake(el) {
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "shake 0.32s ease";
    el.addEventListener("animationend", () => el.style.animation = "", { once: true });
}

console.log("Rental Contract Helper — Phase 1 loaded ✓");
