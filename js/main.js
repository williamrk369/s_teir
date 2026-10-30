(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Simple text bindings ---------- */
  $$("[data-bind]").forEach((el) => (el.textContent = S[el.dataset.bind] ?? ""));
  $$("[data-bind-email]").forEach((el) => {
    el.textContent = S.email;
    el.href = "mailto:" + S.email;
  });
  document.title = `${S.name} — Portfolio, Consulting & Mentorship`;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Sections ---------- */
  $("#stats").innerHTML = S.stats
    .map((s) => `<div class="stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
    .join("");

  $("#about-text").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#skills").innerHTML = S.skills.map((s) => `<li>${esc(s)}</li>`).join("");

  const categories = ["All", ...new Set(S.works.map((w) => w.category))];
  $("#filters").innerHTML = categories
    .map((c, i) => `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${esc(c)}">${esc(c)}</button>`)
    .join("");
  $("#works").innerHTML = S.works
    .map(
      (w) => `
      <article class="card work" data-category="${esc(w.category)}">
        <div class="work__thumb" style="--c:${esc(w.color)}">
          ${w.image ? `<img src="${esc(w.image)}" alt="${esc(w.title)}" loading="lazy" />` : `<span>${esc(w.title.charAt(0))}</span>`}
        </div>
        <div class="work__body">
          <p class="meta">${esc(w.category)} · ${esc(w.year)}</p>
          <h3>${esc(w.title)}</h3>
          <p>${esc(w.description)}</p>
          <ul class="tags">${w.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          ${w.link ? `<a class="link" href="${esc(w.link)}" target="_blank" rel="noopener">View case study →</a>` : ""}
        </div>
      </article>`
    )
    .join("");

  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    $$(".work").forEach((card) => (card.hidden = f !== "All" && card.dataset.category !== f));
  });

  $("#services").innerHTML = S.services
    .map(
      (s) => `
      <article class="card service">
        <div class="service__icon" aria-hidden="true">${esc(s.icon)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.description)}</p>
        <p class="price">${esc(s.price)}</p>
      </article>`
    )
    .join("");

  $("#process").innerHTML = S.process
    .map((p) => `<li><span>${esc(p.step)}</span><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p></li>`)
    .join("");

  $("#programs").innerHTML = S.programs
    .map(
      (p) => `
      <article class="card program${p.featured ? " program--featured" : ""}">
        ${p.featured ? '<span class="badge">Most popular</span>' : ""}
        <h3>${esc(p.title)}</h3>
        <p class="meta">${esc(p.level)} · ${esc(p.duration)}</p>
        <p class="program__price">${esc(p.price)}</p>
        <ul class="checklist">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <a href="#contact" class="btn btn--block${p.featured ? "" : " btn--ghost"}" data-inquiry="student" data-program="${esc(p.title)}">Enroll now</a>
      </article>`
    )
    .join("");

  $("#testimonial-list").innerHTML = S.testimonials
    .map(
      (t) => `
      <figure class="card quote">
        <blockquote>“${esc(t.quote)}”</blockquote>
        <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></figcaption>
      </figure>`
    )
    .join("");

  $("#socials").innerHTML = S.socials
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`)
    .join("");

  $("#service-select").innerHTML = S.services.map((s) => `<option>${esc(s.title)}</option>`).join("");
  $("#program-select").innerHTML = S.programs.map((p) => `<option>${esc(p.title)}</option>`).join("");

  /* ---------- Contact form: client vs student ---------- */
  const form = $("#contact-form");
  const status = $(".form__status", form);

  function setInquiry(type) {
    form.inquiry.value = type;
    $$(".form__tab", form).forEach((t) => t.classList.toggle("is-active", t.dataset.type === type));
    $$("[data-for]", form).forEach((g) => (g.hidden = g.dataset.for !== type));
  }

  $$(".form__tab", form).forEach((t) => t.addEventListener("click", () => setInquiry(t.dataset.type)));

  // "Enroll now" / "Book a consultation" buttons preselect the right form tab.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-inquiry]");
    if (!a) return;
    setInquiry(a.dataset.inquiry);
    if (a.dataset.program) form.program.value = a.dataset.program;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const type = form.inquiry.value;
    const fields = ["name", "email", "message"].concat(
      type === "consulting" ? ["company", "service", "budget"] : ["program", "level"]
    );
    const data = Object.fromEntries(fields.map((f) => [f, form[f].value.trim()]));
    data.inquiry = type === "consulting" ? "Consultancy inquiry" : "Student enrollment";

    if (S.formEndpoint) {
      status.textContent = "Sending…";
      try {
        const res = await fetch(S.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.statusText);
        status.textContent = "Thanks! Your message has been sent — I'll be in touch soon.";
        form.reset();
        setInquiry(type);
      } catch {
        status.textContent = `Something went wrong. Please email me directly at ${S.email}.`;
      }
      return;
    }

    // No endpoint configured: fall back to the visitor's email client.
    const subject = `${data.inquiry} from ${data.name}`;
    const body = Object.entries(data)
      .filter(([k]) => k !== "inquiry")
      .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${S.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Opening your email app…";
  });

  /* ---------- Navigation ---------- */
  const toggle = $(".nav__toggle");
  const links = $(".nav__links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") links.classList.remove("is-open");
  });

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.dataset.theme = saved;
  } catch {}
  $(".theme-toggle").addEventListener("click", () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {}
  });

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.1 }
    );
    $$(".card, .section h2").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
