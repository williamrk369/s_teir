(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const lines = (arr) =>
    arr.map((l, i) => `<span class="line${i === arr.length - 1 ? " accent" : ""}">${esc(l)}</span>`).join("");

  /* ---------- Simple text bindings ---------- */
  $$("[data-bind]").forEach((el) => (el.textContent = S[el.dataset.bind] ?? ""));
  $$("[data-bind-email]").forEach((el) => {
    el.innerHTML = `${esc(S.email)} <span>↗</span>`;
    el.href = "mailto:" + S.email;
  });
  document.title = `${S.name} — Portfolio, Consulting & Mentorship`;
  $("#year").textContent = new Date().getFullYear();
  $("#wordmark").textContent = S.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  /* ---------- Sections ---------- */
  $("#headline").innerHTML = lines(S.headline);
  $("#closing").innerHTML = lines(S.closing);

  $("#stats").innerHTML = S.stats
    .map((s) => `<div class="stat"><dt class="mono">${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`)
    .join("");

  $("#about-text").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#skills").innerHTML = S.skills.map((s, i) => `<li><span>${pad(i + 1)}</span>${esc(s)}</li>`).join("");

  const categories = ["All", ...new Set(S.works.map((w) => w.category))];
  $("#filters").innerHTML = categories
    .map((c, i) => `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${esc(c)}">${esc(c)}</button>`)
    .join("");
  $("#works").innerHTML = S.works
    .map(
      (w, i) => `
      <article class="project ${i % 2 ? "dark" : "light"}" data-category="${esc(w.category)}" style="--c:${esc(w.color)}">
        <div class="wrap">
          <div class="project__top">
            <p class="mono">${pad(i + 1)} / ${esc(w.category)} · ${esc(w.year)}</p>
            <p class="project__desc">${esc(w.description)}</p>
          </div>
          <h3 class="project__title">${esc(w.title)}</h3>
          ${w.image ? `<img class="project__img" src="${esc(w.image)}" alt="${esc(w.title)}" loading="lazy" />` : ""}
          <div class="project__foot">
            <ul class="tags mono">${w.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            ${w.link ? `<a class="explore mono" href="${esc(w.link)}" target="_blank" rel="noopener">Explore project <span>↗</span></a>` : ""}
          </div>
        </div>
      </article>`
    )
    .join("");

  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    $$(".project").forEach((card) => (card.hidden = f !== "All" && card.dataset.category !== f));
  });

  $("#services").innerHTML = S.services
    .map(
      (s, i) => `
      <li class="row">
        <span class="mono row__idx">${pad(i + 1)}</span>
        <h3 class="row__title">${esc(s.title)}</h3>
        <p class="row__desc">${esc(s.description)}</p>
        <span class="mono row__price">${esc(s.price)}</span>
      </li>`
    )
    .join("");

  $("#process").innerHTML = S.process
    .map((p) => `<li><span class="node"></span><p class="mono">${esc(p.step)}</p><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p></li>`)
    .join("");

  $("#programs").innerHTML = S.programs
    .map(
      (p) => `
      <article class="program${p.featured ? " program--featured" : ""}">
        <p class="mono program__meta">${esc(p.level)} · ${esc(p.duration)}${p.featured ? ' <span class="badge">Most popular</span>' : ""}</p>
        <h3>${esc(p.title)}</h3>
        <p class="program__price">${esc(p.price)}</p>
        <ul class="checklist">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <a href="#contact" class="btn${p.featured ? " btn--accent" : ""}" data-inquiry="student" data-program="${esc(p.title)}">Enroll now <span>↗</span></a>
      </article>`
    )
    .join("");

  $("#testimonial-list").innerHTML = S.testimonials
    .map(
      (t) => `
      <figure class="quote">
        <blockquote>“${esc(t.quote)}”</blockquote>
        <figcaption class="mono"><strong>${esc(t.name)}</strong> — ${esc(t.role)}</figcaption>
      </figure>`
    )
    .join("");

  $("#socials").innerHTML = S.socials
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`)
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
    toggle.textContent = open ? "Close" : "Menu";
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.textContent = "Menu";
    }
  });

  /* ---------- Scroll thread + line drawing ---------- */
  const fill = $(".thread__fill");
  const drawn = $$(".hero__line path, .contact__line path");
  drawn.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`;
    drawn.forEach((p) => {
      const r = p.ownerSVGElement.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.4 + r.height * 0.6)));
      p.style.strokeDashoffset = p.getTotalLength() * (1 - t);
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

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
      { threshold: 0.15 }
    );
    $$(".display, .project__title, .row, .program, .quote, .process li").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
