/* ==========================================================================
   ÂNGELO SALAVESSA — site behaviour
   Content comes from content.json (saved by the editor, admin.html).
   The text written in each page is the fallback, so pages read fine
   even if content.json can't load.
   ========================================================================== */
(() => {
"use strict";

/* ---------- 1. Basics ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const root = document.documentElement;
const PAGE = document.body.dataset.page || "home";
const PREVIEW = /[?&]preview\b/.test(location.search);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rich = s => esc(s).replace(/\*([^*\n]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
const pad = n => String(n).padStart(2, "0");
function safe(name, fn) { try { fn(); } catch (e) { console.warn("[site] " + name + ":", e); } }

const ICON = {
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.5-4.7a8.5 8.5 0 1 1 16-4.2z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5v.5c0 .4-.2.7-.6.8-.6.3-1.4.4-2.6-.1a8.4 8.4 0 0 1-4.3-4.3c-.5-1.2-.3-2 0-2.5z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor"/></svg>',
  tt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>'
};

/* ---------- 2. Content ---------- */
const C = {
  settings: { artistName: "Ângelo Salavessa", discipline: "Black & grey realism", instagramHandle: "angelosalavessa_tattoo", whatsappNumber: "31634444502", whatsappDisplay: "+31 6 3444 4502", whatsappGreeting: "Hi Ângelo, I'd like to book a tattoo.", bookingEmail: "", contactEmail: "", youtubeUrl: "", tiktokUrl: "" },
  media: {}, text: {}, seo: {},
  portfolio: [], locations: [], facts: [], values: [], process: [], interests: [], moments: [],
  destinations: [], films: [], journal: [], initiatives: [], impact: []
};
function loadContent() {
  if (PREVIEW) {
    try { const d = window.parent !== window && window.parent.__salavessaDraft; if (d) return Promise.resolve(JSON.parse(JSON.stringify(d))); } catch (e) { /* not same origin */ }
  }
  if (!window.fetch) return Promise.resolve(null);
  const ctrl = "AbortController" in window ? new AbortController() : null;
  const timer = setTimeout(() => ctrl && ctrl.abort(), 3500);
  return fetch("content.json?v=" + Date.now(), { cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
    .then(r => (r.ok ? r.json() : null)).catch(() => null)
    .then(d => { clearTimeout(timer); return d; });
}
function merge(d) {
  if (!d || typeof d !== "object") return;
  Object.keys(C).forEach(k => {
    if (!(k in d)) return;
    if (Array.isArray(C[k])) { if (Array.isArray(d[k])) C[k] = d[k]; }
    else if (d[k] && typeof d[k] === "object") Object.assign(C[k], d[k]);
  });
}
const S = () => C.settings;
const igHandle = () => String(S().instagramHandle || "").replace(/^@/, "").trim();
const igUrl = () => igHandle() ? `https://www.instagram.com/${igHandle()}/` : "";
function waLink(text) {
  const n = String(S().whatsappNumber || "").replace(/\D/g, "");
  return n ? `https://wa.me/${n}${text ? "?text=" + encodeURIComponent(text) : ""}` : "";
}
function openExternal(url) { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); }
function hrefFor(path) { return PREVIEW && /^[a-z-]+\.html/.test(path) ? path.replace(/(\.html)(\?[^#]*)?/, (m, ext, q) => ext + (q ? q + "&" : "?") + "preview=1") : path; }

/* ---------- 3. Media helper (real photo, or an honest placeholder) ---------- */
function ph(label, subject) {
  return `<div class="ph" role="img" aria-label="${esc(subject || "Photo coming soon")}"><span class="ph__t"><small>${esc(label || "Photo coming soon")}</small><span>${esc(subject || "")}</span></span></div>`;
}
function media(src, alt, o = {}) {
  if (!src) return ph(o.label, o.subject || alt);
  const pos = o.position ? ` style="object-position:${esc(o.position)}"` : "";
  return `<img src="${esc(src)}" alt="${esc(alt || "")}"${pos} loading="${o.eager ? "eager" : "lazy"}" decoding="async" data-ph-label="${esc(o.label || "Photo coming soon")}" data-ph-subject="${esc(o.subject || alt || "")}">`;
}
document.addEventListener("error", e => {
  const img = e.target;
  if (img && img.tagName === "IMG" && img.dataset.phLabel != null && img.parentNode) {
    const box = document.createElement("div"); box.innerHTML = ph(img.dataset.phLabel, img.dataset.phSubject);
    img.replaceWith(box.firstChild);
  }
}, true);

/* ---------- 4. Apply text, images, links ---------- */
function applyText() {
  $$("[data-edit]").forEach(el => { const v = C.text[el.dataset.edit]; if (typeof v === "string") el.innerHTML = rich(v); });
  $$("[data-set]").forEach(el => { const v = S()[el.dataset.set]; if (v) el.textContent = v; });
  if (C.seo && C.seo[PAGE]) {
    const s = C.seo[PAGE];
    if (s.title) document.title = s.title;
    const m = $('meta[name="description"]'); if (m && s.description) m.setAttribute("content", s.description);
  }
}
function applyImages() {
  $$("[data-img]").forEach(el => {
    const key = el.dataset.img;
    if (!(key in C.media)) return;
    el.innerHTML = media(C.media[key], el.dataset.alt || "", { eager: el.hasAttribute("data-eager"), position: C.media[key + "Position"] || el.dataset.pos, label: "Photo coming soon", subject: el.dataset.alt });
  });
}
function applyLinks() {
  $$("[data-link]").forEach(a => {
    const kind = a.dataset.link;
    let url = "";
    if (kind === "whatsapp") url = waLink(a.dataset.waText || S().whatsappGreeting);
    else if (kind === "instagram") url = igUrl();
    else if (kind === "email") url = S().contactEmail ? "mailto:" + S().contactEmail : "";
    else if (kind === "youtube") url = S().youtubeUrl || "";
    else if (kind === "tiktok") url = S().tiktokUrl || "";
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
    else if (a.dataset.optional != null) a.hidden = true;
  });
  $$("[data-show-if]").forEach(el => { el.hidden = !S()[el.dataset.showIf]; });
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  if (PREVIEW) {
    $$('a[href]').forEach(a => { const h = a.getAttribute("href"); if (/^[a-z-]+\.html/.test(h)) a.setAttribute("href", hrefFor(h)); });
  }
}

/* ---------- 5. Renderers ---------- */
const portfolio = () => C.portfolio.filter(p => p && p.image && p.title);

function renderCraftHome() {
  const box = $("#home-craft"); if (!box) return;
  const list = portfolio(); const feat = list.filter(p => p.featured);
  const pick = (feat.length >= 4 ? feat : feat.concat(list.filter(p => !p.featured))).slice(0, 4);
  box.innerHTML = pick.map((p, i) => `
    <figure class="craft__piece" data-reveal style="--d:${i * 0.08}s">
      <a href="${hrefFor("tattoos.html")}#gallery" class="frame" data-parallax="0.06" aria-label="${esc(p.title)} — open the portfolio">${media(p.image, p.alt, { position: p.position })}</a>
      <figcaption><strong>${esc(p.title)}</strong><span>${esc(p.category || "")}</span></figcaption>
    </figure>`).join("");
}

let galleryIdx = [];
function renderGallery() {
  const grid = $("#gallery-grid"), bar = $("#filters"); if (!grid) return;
  const list = portfolio();
  const cats = []; list.forEach(p => { if (p.category && !cats.includes(p.category)) cats.push(p.category); });
  const count = c => c === "All" ? list.length : list.filter(p => p.category === c).length;
  bar.innerHTML = ["All"].concat(cats).map(c => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}<sup>${count(c)}</sup></button>`).join("");
  grid.innerHTML = list.map((p, i) => {
    const ratio = String(p.ratio || "4/5").replace(/\s/g, "");
    return `<div class="tile" data-cat="${esc(p.category || "")}" data-reveal style="--d:${(i % 3) * 0.06}s">
      <button class="tile__btn" type="button" data-open="${i}" aria-label="View ${esc(p.title)} larger">
        <span class="frame" style="display:block;aspect-ratio:${esc(ratio)}">${media(p.image, p.alt, { position: p.position })}<span class="tile__view glass">View</span></span>
        <span class="tile__cap"><strong>${esc(p.title)}</strong><span>${esc([p.category, p.placement].filter(Boolean).join(" · "))}</span></span>
      </button></div>`;
  }).join("");
  galleryIdx = list.map((_, i) => i);
  bar.onclick = e => {
    const b = e.target.closest("[data-filter]"); if (!b) return;
    const cat = b.dataset.filter;
    $$("[data-filter]", bar).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const tiles = $$(".tile", grid);
    tiles.forEach(t => t.classList.add("is-hiding"));
    setTimeout(() => {
      tiles.forEach(t => { t.hidden = !(cat === "All" || t.dataset.cat === cat); t.classList.add("is-in"); });
      requestAnimationFrame(() => tiles.forEach(t => t.classList.remove("is-hiding")));
      galleryIdx = list.map((p, i) => i).filter(i => cat === "All" || list[i].category === cat);
      const st = $("#filter-status"); if (st) st.textContent = `Showing ${galleryIdx.length} pieces${cat === "All" ? "" : " in " + cat}.`;
    }, reduced ? 0 : 260);
  };
}

function renderProcess() {
  const box = $("#process-list"); if (!box || !C.process.length) return;
  box.innerHTML = C.process.map((s, i) => `<li class="step"><span class="step__no">${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.tag ? `<small>${esc(s.tag)}</small>` : ""}</li>`).join("");
}
function renderPlaces() {
  const box = $("#places");
  if (box) box.innerHTML = C.locations.filter(l => l && l.name).map((l, i) => `
    <li class="place" data-reveal><span class="num">${pad(i + 1)}</span><strong>${esc(l.name)}</strong><span>${esc([l.note, l.dates].filter(Boolean).join(" · "))}</span></li>`).join("");
  const pills = $("#where-pills");
  if (pills) {
    const opts = C.locations.filter(l => l && l.name).map(l => l.name).concat(["Flexible"]);
    pills.innerHTML = opts.map((n, i) => `<label class="pill"><input type="radio" name="where" value="${esc(n)}"${i === opts.length - 1 ? " checked" : ""}><span>${esc(n)}</span></label>`).join("");
  }
}
function renderFacts() {
  const box = $("#facts"); if (!box || !C.facts.length) return;
  box.innerHTML = C.facts.filter(f => f && (f.label || f.value)).map(f => `<div class="fact"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
}
function renderValues() {
  const box = $("#values"); if (!box || !C.values.length) return;
  box.innerHTML = C.values.map((v, i) => `<div class="value" data-reveal style="--d:${i * 0.08}s"><span class="num">${pad(i + 1)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join("");
}
function renderInterests() {
  const box = $("#interests"); if (!box || !C.interests.length) return;
  box.innerHTML = C.interests.map(w => `<span class="chip">${esc(w)}</span>`).join("");
}
function renderMoments() {
  const box = $("#moments"); if (!box) return;
  box.innerHTML = C.moments.map((m, i) => `
    <figure class="moment" data-reveal>
      <div class="frame" data-parallax="0.07">${media(m.image, m.title, { position: m.position, subject: m.title })}</div>
      <figcaption class="moment__cap"><span class="num">${pad(i + 1)}</span>${m.tag ? `<small>${esc(m.tag)}</small>` : ""}<h3>${esc(m.title)}</h3>${m.text ? `<p>${esc(m.text)}</p>` : ""}</figcaption>
    </figure>`).join("");
}
function renderDestinations() {
  const slides = $("#travel-slides");
  const list = C.destinations.filter(d => d && d.name);
  if (slides) {
    slides.innerHTML = list.map((d, i) => `
      <div class="slide${i === 0 ? " is-active" : ""}" aria-hidden="${i !== 0}">
        <div class="frame">${media(d.image, d.name + (d.region ? ", " + d.region : ""), { position: d.position, subject: d.name })}</div>
        <div class="slide__panel glass"><small>${esc(d.region || "Destination")}</small><strong>${esc(d.name)}</strong>${d.text ? `<p>${esc(d.text)}</p>` : ""}</div>
      </div>`).join("");
    const tot = $("#travel-total"); if (tot) tot.textContent = pad(list.length);
  }
  const listBox = $("#dest-list");
  if (listBox) {
    listBox.innerHTML = list.map((d, i) => `
      <li class="dest" data-reveal data-dest="${i}">
        <span class="num">${pad(i + 1)}</span>
        <span class="dest__name">${esc(d.name)}</span>
        <span class="dest__thumb frame">${media(d.image, d.name, { position: d.position, subject: d.name })}</span>
        <span class="dest__info"><small>${esc(d.region || "")}</small>${esc(d.text || "")}</span>
      </li>`).join("");
  }
}
function renderFilms() {
  const box = $("#films"); if (!box) return;
  const list = C.films.filter(f => f && (f.url || f.title));
  if (!list.length) {
    box.innerHTML = [1, 2, 3].map(i => `<div class="film" data-reveal style="--d:${i * 0.08}s"><div class="frame">${ph("Film " + pad(i), "Coming soon")}</div><h3>Coming soon</h3></div>`).join("");
    return;
  }
  box.innerHTML = list.map((f, i) => `
    <div class="film" data-reveal style="--d:${(i % 3) * 0.08}s">
      <div class="frame">${media(f.poster, f.title, { subject: f.title })}${f.url ? `<button class="film__play glass" type="button" data-film="${i}" aria-label="Play ${esc(f.title)}">${ICON.play}</button>` : ""}</div>
      <h3>${esc(f.title)}</h3>${f.place ? `<span class="num">${esc(f.place)}</span>` : ""}
    </div>`).join("");
  box.onclick = e => {
    const b = e.target.closest("[data-film]"); if (!b) return;
    const f = list[+b.dataset.film]; const frame = b.parentElement;
    const yt = String(f.url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    frame.innerHTML = yt
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0" title="${esc(f.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<video src="${esc(f.url)}" controls autoplay playsinline></video>`;
  };
}
const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const posts = () => C.journal.filter(p => p && p.title).map(p => (p.slug ? p : Object.assign({}, p, { slug: slugify(p.title) })));
function jcard(p, i) {
  return `<a class="jcard" href="${hrefFor("article.html?a=" + encodeURIComponent(p.slug))}" data-reveal style="--d:${(i % 3) * 0.08}s">
    <span class="frame">${media(p.cover, p.title, { position: p.coverPosition, subject: p.title })}</span>
    <span class="jcard__meta">${esc(p.category || "Journal")}${p.place ? " · " + esc(p.place) : ""}</span>
    <h3>${esc(p.title)}</h3>${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ""}
    <span class="link">Read more <span class="arrow">→</span></span></a>`;
}
function renderJournal() {
  const home = $("#home-journal");
  if (home) home.innerHTML = posts().slice(0, 2).map(jcard).join("");
  const feat = $("#journal-feature"), grid = $("#journal-grid"), bar = $("#journal-filters");
  if (!grid) return;
  const list = posts();
  if (!list.length) { feat.innerHTML = ""; grid.innerHTML = `<p class="empty-note">The first stories are on their way.</p>`; return; }
  const first = list[0];
  feat.innerHTML = `<a class="jfeature" href="${hrefFor("article.html?a=" + encodeURIComponent(first.slug))}">
      <span class="frame" data-reveal="mask">${media(first.cover, first.title, { position: first.coverPosition, eager: true, subject: first.title })}</span>
      <span class="jfeature__text" data-reveal><span class="jcard__meta">Latest · ${esc(first.category || "Journal")}</span><h2>${esc(first.title)}</h2>${first.excerpt ? `<p class="lead">${esc(first.excerpt)}</p>` : ""}<span class="link">Read the story <span class="arrow">→</span></span></span></a>`;
  const cats = []; list.forEach(p => { if (p.category && !cats.includes(p.category)) cats.push(p.category); });
  bar.innerHTML = ["All"].concat(cats).map(c => `<button class="filter" type="button" data-cat="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}</button>`).join("");
  const draw = cat => { grid.innerHTML = list.slice(1).filter(p => cat === "All" || p.category === cat).map(jcard).join("") || `<p class="empty-note">More stories in this category soon.</p>`; observeReveals(grid); };
  draw("All");
  bar.onclick = e => { const b = e.target.closest("[data-cat]"); if (!b) return; $$("[data-cat]", bar).forEach(x => x.setAttribute("aria-pressed", String(x === b))); draw(b.dataset.cat); };
}
function articleBody(text) {
  return String(text || "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p =>
    p.startsWith("> ") ? `<blockquote>${rich(p.replace(/^> ?/gm, ""))}</blockquote>` : `<p>${rich(p)}</p>`).join("");
}
function renderArticle() {
  const box = $("#article"); if (!box) return;
  const slug = new URLSearchParams(location.search).get("a");
  const list = posts();
  const i = Math.max(0, list.findIndex(p => p.slug === slug));
  const p = list[i];
  if (!p) { box.innerHTML = `<div class="wrap article__head"><h1>Story not found</h1><a class="link" href="journal.html">Back to the journal <span class="arrow">→</span></a></div>`; return; }
  document.title = `${p.title} — Journal — ${S().artistName}`;
  const m = $('meta[name="description"]'); if (m && p.excerpt) m.setAttribute("content", p.excerpt);
  const next = list[(i + 1) % list.length];
  box.innerHTML = `
    <header class="wrap article__head">
      <nav class="crumb" aria-label="Breadcrumb"><a href="${hrefFor("journal.html")}">Journal</a><span>/</span><span>${esc(p.category || "Story")}</span></nav>
      <span class="jcard__meta">${esc(p.category || "")}${p.place ? " · " + esc(p.place) : ""}${p.date ? " · " + esc(p.date) : ""}</span>
      <h1 data-split>${esc(p.title)}</h1>
      ${p.excerpt ? `<p class="lead">${esc(p.excerpt)}</p>` : ""}
    </header>
    <div class="wrap"><div class="frame article__cover" data-reveal="mask" data-parallax="0.08">${media(p.cover, p.title, { position: p.coverPosition, eager: true, subject: p.title })}</div></div>
    <div class="wrap"><div class="article__body">${articleBody(p.body)}</div>
      <p class="article__source">${p.source ? `<span>${esc(p.source)}</span>` : "<span></span>"}<a class="link" href="${hrefFor("journal.html")}">All stories <span class="arrow">→</span></a></p></div>
    ${next && next !== p ? `<section class="wrap article__next"><p class="label">Next story</p><div style="margin-top:28px;max-width:520px">${jcard(next, 0)}</div></section>` : ""}`;
}
function renderInitiatives() {
  const box = $("#inits"); if (!box) return;
  const list = C.initiatives.filter(x => x && x.title);
  box.innerHTML = list.map((x, i) => `
    <article class="init" data-reveal style="--d:${i * 0.08}s">
      <div class="frame">${media(x.image, x.title, { position: x.position, subject: x.title })}</div>
      ${x.status ? `<span class="init__status">${esc(x.status)}${x.place ? " · " + esc(x.place) : ""}</span>` : ""}
      <h3>${esc(x.title)}</h3><p>${esc(x.text || "")}</p>
      ${x.link ? `<a class="link" href="${esc(hrefFor(x.link))}">Read the story <span class="arrow">→</span></a>` : ""}
    </article>`).join("") + `
    <div class="init init--next" data-reveal style="--d:${list.length * 0.08}s"><span class="init__status">Next</span><h3>The next initiative</h3><p>Announced here when it's real. Want to suggest someone who needs help?</p><a class="link" data-link="whatsapp" data-wa-text="Hi Ângelo, I'd like to suggest someone The Last Soul could help." href="#">Tell me <span class="arrow">→</span></a></div>`;
}
function renderImpact() {
  const box = $("#impact"); if (!box) return;
  const list = C.impact.filter(x => x && x.title);
  if (!list.length) { box.innerHTML = `<p class="empty-note" data-reveal>Impact will be shared here as it happens — what was done, for whom, and with whose help. Real stories, no inflated numbers.</p>`; return; }
  box.innerHTML = `<div class="inits">${list.map((x, i) => `<article class="init" data-reveal style="--d:${i * 0.08}s"><div class="frame">${media(x.image, x.title, { subject: x.title })}</div>${x.figure ? `<span class="init__status">${esc(x.figure)}</span>` : ""}<h3>${esc(x.title)}</h3><p>${esc(x.text || "")}</p></article>`).join("")}</div>`;
}

/* ---------- 6. Motion ---------- */
function splitWords(scope = document) {
  $$("[data-split]", scope).forEach(el => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "1";
    let n = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(ch => {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const inner = document.createElement("span"); inner.textContent = t; inner.style.setProperty("--i", n++);
            w.appendChild(inner); frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== "BR") walk(ch);
      });
    };
    walk(el);
  });
}
let io = null; const watch = new Map();
function observeReveals(scope = document) {
  const els = $$("[data-reveal]:not(.is-in), [data-split]:not(.is-in)", scope);
  if (reduced || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-in")); return; }
  // A fully clipped element counts as invisible to IntersectionObserver,
  // so masked reveals are watched through their (unclipped) parent.
  if (!io) io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    (watch.get(en.target) || [en.target]).forEach(el => el.classList.add("is-in"));
    watch.delete(en.target); io.unobserve(en.target);
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
  els.forEach(e => {
    const target = e.dataset.reveal === "mask" && e.parentElement ? e.parentElement : e;
    if (!watch.has(target)) watch.set(target, []);
    watch.get(target).push(e);
    io.observe(target);
  });
}

const motion = { items: [], hero: null, nav: null, lastY: 0, ticking: false, mx: 0, my: 0, cmx: 0, cmy: 0 };
function measureParallax() {
  motion.items = $$("[data-parallax]").map(el => ({ el, inner: el.firstElementChild, speed: parseFloat(el.dataset.parallax) || 0.08 })).filter(x => x.inner);
}
function frame() {
  motion.ticking = false;
  const y = window.scrollY, vh = window.innerHeight;
  // Navigation: glass after a little scroll, hides on scroll down
  const nav = motion.nav;
  if (nav) {
    nav.classList.toggle("is-solid", y > 24 || document.body.dataset.navSolid != null);
    const down = y > motion.lastY + 4, up = y < motion.lastY - 4;
    if (!root.classList.contains("is-locked")) {
      if (down && y > 420) nav.classList.add("is-hidden");
      else if (up || y < 200) nav.classList.remove("is-hidden");
    }
  }
  motion.lastY = y;
  if (reduced) return;
  // Hero: slow camera drift with scroll + pointer
  motion.cmx += (motion.mx - motion.cmx) * 0.08; motion.cmy += (motion.my - motion.cmy) * 0.08;
  const h = motion.hero;
  if (h && y < vh * 1.2) {
    h.style.transform = `translate3d(${(-motion.cmx * 14).toFixed(2)}px, ${(y * 0.22 - motion.cmy * 10).toFixed(2)}px, 0) scale(${(1.02 + y / vh * 0.06).toFixed(4)})`;
  }
  for (const it of motion.items) {
    const r = it.el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) continue;
    const d = (r.top + r.height / 2 - vh / 2) / vh;
    it.inner.style.transform = `translate3d(0, ${(-d * it.speed * 100).toFixed(2)}%, 0)`;
  }
  if (Math.abs(motion.mx - motion.cmx) + Math.abs(motion.my - motion.cmy) > 0.002) schedule();
}
function schedule() { if (!motion.ticking) { motion.ticking = true; requestAnimationFrame(frame); } }
function initMotion() {
  motion.nav = $(".nav");
  const heroMedia = $(".hero__media");
  if (heroMedia) motion.hero = heroMedia.firstElementChild;
  measureParallax();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => { measureParallax(); schedule(); });
  if (fine) window.addEventListener("pointermove", e => { motion.mx = e.clientX / innerWidth * 2 - 1; motion.my = e.clientY / innerHeight * 2 - 1; schedule(); }, { passive: true });
  schedule();
}
function initMagnetic() {
  if (!fine || reduced) return;
  $$(".btn, .wa").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`; });
    b.addEventListener("pointerleave", () => { b.style.translate = ""; });
  });
}

/* ---------- 7. Navigation + menu ---------- */
let lockN = 0;
function lock(on) {
  lockN = Math.max(0, lockN + (on ? 1 : -1));
  const l = lockN > 0;
  root.classList.toggle("is-locked", l);
  root.style.overflow = l ? "hidden" : "";
}
function initNav() {
  const here = (location.pathname.split("/").pop() || "index.html").replace(/\?.*/, "");
  const cur = here === "article.html" ? "journal.html" : here;
  $$(".nav__links a, .menu__list a").forEach(a => { if ((a.getAttribute("href") || "").split("?")[0] === cur) a.setAttribute("aria-current", "page"); });
  const btn = $(".nav__menu"), menu = $("#menu"); if (!btn || !menu) return;
  let open = false;
  const set = v => {
    if (v === open) return; open = v;
    btn.setAttribute("aria-expanded", String(v)); $(".nav__menu-t", btn).textContent = v ? "Close" : "Menu";
    menu.classList.toggle("is-open", v); menu.setAttribute("aria-hidden", String(!v)); lock(v);
    $(".nav").classList.remove("is-hidden"); $(".nav").classList.toggle("nav--solid", v);
    if (v) setTimeout(() => { const a = $("a", menu); a && a.focus({ preventScroll: true }); }, 60);
  };
  btn.addEventListener("click", () => set(!open));
  $$("a", menu).forEach(a => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", e => {
    if (!open) return;
    if (e.key === "Escape") { set(false); btn.focus(); }
    if (e.key === "Tab") {
      const f = [btn].concat($$("a:not([hidden])", menu)); const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia("(min-width: 961px)").addEventListener("change", e => { if (e.matches) set(false); });
}

/* ---------- 8. Home: loader, travel slider, old links ---------- */
function initLoader() {
  const el = $(".loader"); if (!el) return;
  if (!root.classList.contains("is-loading")) return;
  setTimeout(() => { el.classList.add("is-out"); setTimeout(() => root.classList.remove("is-loading"), 800); }, 950);
}
function initSlider() {
  const box = $("#travel-slides"); if (!box) return;
  const slides = $$(".slide", box); const cur = $("#travel-cur");
  if (slides.length < 2) { $$("[data-slide]").forEach(b => b.hidden = true); return; }
  let i = 0, timer = 0, visible = false;
  const go = n => {
    const prev = slides[i]; i = (n + slides.length) % slides.length;
    if (prev === slides[i]) return;
    slides.forEach(s => s.classList.remove("is-leaving"));
    prev.classList.remove("is-active"); prev.classList.add("is-leaving"); prev.setAttribute("aria-hidden", "true");
    slides[i].classList.add("is-active"); slides[i].setAttribute("aria-hidden", "false");
    if (cur) cur.textContent = pad(i + 1);
    setTimeout(() => prev.classList.remove("is-leaving"), 1250);
    restart();
  };
  const restart = () => { clearTimeout(timer); if (!reduced && visible) timer = setTimeout(() => go(i + 1), 6500); };
  $$("[data-slide]").forEach(b => b.addEventListener("click", () => go(i + (+b.dataset.slide))));
  let sx = 0;
  box.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); }, { passive: true });
  box.addEventListener("pointerenter", () => clearTimeout(timer));
  box.addEventListener("pointerleave", restart);
  if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; restart(); }, { threshold: 0.3 }).observe(box);
}
function redirectOldAnchors() {
  const map = { work: "tattoos.html#gallery", index: "tattoos.html#gallery", process: "tattoos.html#process", travel: "tattoos.html#where", booking: "tattoos.html#booking", artist: "about.html", contact: "contact.html" };
  const h = location.hash.slice(1);
  if (map[h]) location.replace(map[h]);
}

/* ---------- 9. Travel: image that follows the cursor ---------- */
function initDestFloat() {
  const list = $("#dest-list"); if (!list || !fine || reduced) return;
  const fl = document.createElement("div"); fl.className = "dest-float"; fl.innerHTML = '<div class="frame"></div>'; document.body.appendChild(fl);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14; fl.style.transform = `translate3d(${x - 150}px, ${y - 190}px, 0) rotate(${((tx - x) * 0.03).toFixed(2)}deg)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0; };
  list.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
  list.addEventListener("pointerover", e => {
    const row = e.target.closest("[data-dest]"); if (!row) return;
    const d = C.destinations.filter(z => z && z.name)[+row.dataset.dest];
    $(".frame", fl).innerHTML = media(d && d.image, d && d.name, { position: d && d.position, subject: d && d.name });
    fl.classList.add("is-on");
  });
  list.addEventListener("pointerleave", () => fl.classList.remove("is-on"));
}

/* ---------- 10. Horizontal scrollers ---------- */
function initHScroll() {
  $$("[data-hscroll]").forEach(ctrl => {
    const track = $(ctrl.dataset.hscroll); if (!track) return;
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
    $$("[data-dir]", ctrl).forEach(b => b.addEventListener("click", () => track.scrollBy({ left: step() * (+b.dataset.dir), behavior: reduced ? "auto" : "smooth" })));
    const sync = () => { const [p, n] = $$("[data-dir]", ctrl); if (p) p.disabled = track.scrollLeft < 8; if (n) n.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8; };
    track.addEventListener("scroll", sync, { passive: true }); sync();
  });
}

/* ---------- 11. Lightbox ---------- */
function initLightbox() {
  const lb = $("#lightbox"); if (!lb) return;
  const img = $(".lightbox__img", lb); let list = [], at = 0, last = null;
  const paint = () => {
    const p = portfolio()[list[at]]; if (!p) return;
    img.src = p.image; img.alt = p.alt || p.title;
    $("#lb-title").textContent = p.title;
    $("#lb-meta").innerHTML = [p.category, p.placement, S().discipline].filter(Boolean).map(x => `<span class="chip">${esc(x)}</span>`).join("");
    $("#lb-desc").textContent = p.description || "";
    $("#lb-count").textContent = `${pad(at + 1)} / ${pad(list.length)}`;
    $("#lb-wa").href = waLink(`Hi Ângelo, I saw "${p.title}" on your website and I'd like to book something similar.`);
  };
  const open = (i, from) => {
    list = galleryIdx.length ? galleryIdx.slice() : portfolio().map((_, k) => k);
    at = Math.max(0, list.indexOf(i)); last = from; paint();
    lb.hidden = false; lock(true); requestAnimationFrame(() => lb.classList.add("is-open"));
    $("#lb-close").focus({ preventScroll: true });
  };
  const close = () => { lb.classList.remove("is-open"); setTimeout(() => { lb.hidden = true; lock(false); last && last.focus({ preventScroll: true }); }, reduced ? 0 : 380); };
  const step = d => {
    if (list.length < 2) return;
    lb.style.setProperty("--dir", (d > 0 ? -24 : 24) + "px"); lb.classList.add("is-swapping");
    setTimeout(() => { at = (at + d + list.length) % list.length; paint(); lb.style.setProperty("--dir", (d > 0 ? 24 : -24) + "px"); requestAnimationFrame(() => lb.classList.remove("is-swapping")); }, reduced ? 0 : 260);
  };
  document.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) { e.preventDefault(); open(+b.dataset.open, b); } });
  $("#lb-close").addEventListener("click", close);
  $("#lb-prev").addEventListener("click", () => step(-1));
  $("#lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__stage")) close(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") { const f = $$("button, a[href]", lb).filter(x => x.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
  let sx = 0;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
}

/* ---------- 12. Booking form (tattoos page) ---------- */
async function copyText(t) {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return true; } } catch (e) { /* fall through */ }
  try { const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok; } catch (e) { return false; }
}
function initBooking() {
  const form = $("#booking-form"); if (!form) return;
  const review = $("#review"), status = $("#review-status"), errBox = $("#form-errors");
  const val = n => { const el = form.elements[n]; if (!el) return ""; if (el instanceof RadioNodeList) return el.value || ""; return (el.value || "").trim(); };
  const fieldOf = n => $(`[data-field="${n}"]`, form);
  const setErr = (n, msg) => { const f = fieldOf(n); if (!f) return; f.classList.toggle("has-error", !!msg); const e = $(".field__err", f); if (e) e.textContent = msg || ""; const i = $("input:not([type=radio]), textarea, select", f); if (i) i.setAttribute("aria-invalid", msg ? "true" : "false"); };
  form.addEventListener("change", e => {
    if (e.target.name === "placement") { const o = fieldOf("placementOther"); o.hidden = e.target.value !== "Other"; if (!o.hidden) $("input", o).focus(); }
    if (e.target.name === "contact") $$("[data-need]", form).forEach(s => { s.textContent = s.dataset.need === e.target.value ? "*" : "(optional)"; s.className = s.textContent === "*" ? "req" : "opt"; });
  });
  const validate = () => {
    const errs = [], chk = (n, ok, m) => { setErr(n, ok ? "" : m); if (!ok) errs.push([n, m]); };
    const c = val("contact"), ig = val("instagram").replace(/^@/, ""), em = val("email");
    chk("name", val("name").length >= 2, "Please add your name.");
    chk("instagram", c === "Instagram" ? /^[\w.]{1,30}$/.test(ig) : (!ig || /^[\w.]{1,30}$/.test(ig)), c === "Instagram" && !ig ? "Add your Instagram so he can reply." : "That doesn't look like an Instagram handle.");
    chk("email", c === "Email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) : (!em || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)), c === "Email" && !em ? "Add your email so he can reply." : "Please check the email address.");
    chk("idea", val("idea").length >= 10, "Tell him a little about the idea — a sentence or two.");
    chk("placement", !!val("placement"), "Choose a placement.");
    if (val("placement") === "Other") chk("placementOther", val("placementOther").length >= 2, "Where on the body?"); else setErr("placementOther", "");
    chk("size", !!val("size"), "Pick an approximate size — “Not sure” is fine.");
    const refs = val("references").split(/\n+/).map(s => s.trim()).filter(Boolean);
    chk("references", refs.every(u => /^https?:\/\/\S+$/i.test(u)), "Each reference should be a full link starting with https://");
    return errs;
  };
  const compose = () => {
    const ig = val("instagram").replace(/^@/, ""), c = val("contact");
    const L = [`Hi ${S().artistName.split(" ")[0]} — tattoo enquiry from your website.`, "", `Name: ${val("name")}`, `Reply via: ${c === "WhatsApp" ? "WhatsApp (this chat)" : c}${c === "Instagram" ? " (@" + ig + ")" : c === "Email" ? " (" + val("email") + ")" : ""}`];
    if (c !== "Email" && val("email")) L.push(`Email: ${val("email")}`);
    if (c !== "Instagram" && ig) L.push(`Instagram: @${ig}`);
    L.push("", `Idea: ${val("idea")}`, "", `Placement: ${val("placement") === "Other" ? val("placementOther") : val("placement")}`, `Size: ${val("size")}`, `Skin: ${val("skin")}`, `Where: ${val("where")}`);
    if (val("dates")) L.push(`Availability: ${val("dates")}`);
    if (val("budget")) L.push(`Budget: ${val("budget")}`);
    const refs = val("references").split(/\n+/).map(s => s.trim()).filter(Boolean);
    if (refs.length) L.push("", "References:", ...refs.map(r => "• " + r));
    if (val("notes")) L.push("", `Notes: ${val("notes")}`);
    L.push("", "(I can send reference images in this chat.)");
    return L.join("\n");
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) {
      errBox.hidden = false;
      errBox.innerHTML = `<strong>${errs.length} thing${errs.length > 1 ? "s" : ""} to fix</strong>` + errs.map(([n, m]) => `<a href="#" data-goto="${n}">${esc(m)}</a>`).join("");
      errBox.focus(); return;
    }
    errBox.hidden = true;
    $("#review-text").textContent = compose();
    status.textContent = ""; status.className = "review__status";
    form.hidden = true; review.hidden = false;
    review.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); review.focus({ preventScroll: true });
  });
  errBox.addEventListener("click", e => { const a = e.target.closest("[data-goto]"); if (!a) return; e.preventDefault(); const f = fieldOf(a.dataset.goto); const i = f && $("input, textarea, select", f); i && i.focus(); });
  const say = (h, ok) => { status.innerHTML = h; status.className = "review__status" + (ok ? " is-ok" : ""); };
  $("#btn-wa").addEventListener("click", () => { const u = waLink($("#review-text").textContent); openExternal(u); say(`WhatsApp is opening with your message written. <strong>It's only sent when you tap send.</strong> Nothing opened? <a href="${esc(u)}" target="_blank" rel="noopener">Tap here</a>.`, true); });
  $("#btn-ig").addEventListener("click", async () => { const ok = await copyText($("#review-text").textContent); openExternal(igHandle() ? `https://ig.me/m/${igHandle()}` : igUrl()); say(ok ? `Copied. Paste it into the Instagram DM to @${esc(igHandle())} and send.` : "Copy the message above, then paste it into the Instagram DM.", ok); });
  $("#btn-copy").addEventListener("click", async () => { const ok = await copyText($("#review-text").textContent); say(ok ? "Copied — <strong>nothing has been sent yet</strong>." : "Select the message above and copy it manually.", ok); });
  $("#btn-edit").addEventListener("click", () => { review.hidden = true; form.hidden = false; form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); $("#f-idea").focus({ preventScroll: true }); });
}

/* ---------- 13. Contact composer ---------- */
function initContact() {
  const f = $("#contact-form"); if (!f) return;
  f.addEventListener("submit", e => {
    e.preventDefault();
    const topic = (f.elements.topic && f.elements.topic.value) || "Something else";
    const name = f.elements.name.value.trim(), msg = f.elements.message.value.trim();
    const err = $("#contact-err");
    if (msg.length < 5) { err.textContent = "Write a short message first."; f.elements.message.focus(); return; }
    err.textContent = "";
    const text = `Hi ${S().artistName.split(" ")[0]}${name ? ", this is " + name : ""}.\nTopic: ${topic}\n\n${msg}`;
    const u = waLink(text); openExternal(u);
    $("#contact-ok").innerHTML = `WhatsApp is opening with your message. <strong>It's only sent when you tap send.</strong> Nothing opened? <a href="${esc(u)}" target="_blank" rel="noopener">Tap here</a>.`;
  });
}

/* ---------- 14. Boot ---------- */
function render() {
  safe("text", applyText);
  safe("images", applyImages);
  safe("craft", renderCraftHome);
  safe("gallery", renderGallery);
  safe("process", renderProcess);
  safe("places", renderPlaces);
  safe("facts", renderFacts);
  safe("values", renderValues);
  safe("interests", renderInterests);
  safe("moments", renderMoments);
  safe("destinations", renderDestinations);
  safe("films", renderFilms);
  safe("journal", renderJournal);
  safe("article", renderArticle);
  safe("initiatives", renderInitiatives);
  safe("impact", renderImpact);
  safe("links", applyLinks);
}
function boot(d) {
  if (d) safe("merge", () => merge(d));
  render();
  safe("split", () => splitWords());
  safe("reveals", () => observeReveals());
  safe("nav", initNav);
  safe("motion", initMotion);
  safe("magnetic", initMagnetic);
  safe("slider", initSlider);
  safe("dest", initDestFloat);
  safe("hscroll", initHScroll);
  safe("lightbox", initLightbox);
  safe("booking", initBooking);
  safe("contact", initContact);
  safe("loader", initLoader);
  clearTimeout(window.__boot); root.classList.add("is-ready");
}
if (PAGE === "home") redirectOldAnchors();
loadContent().then(boot, () => boot(null));
})();
