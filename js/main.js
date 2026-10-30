(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const lineWrap = (html, cls = "") => `<span class="line${cls}"><span class="line__in">${html}</span></span>`;
  const lines = (arr) => arr.map((l, i) => lineWrap(esc(l), i === arr.length - 1 ? " accent" : "")).join("");
  const words = (text) => esc(text).split(" ").map((w) => `<span class="word"><span class="word__in">${w}</span></span>`).join(" ");

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
  // Static headings written with <br> get the same masked-line structure.
  $$("h2.display").forEach((h) => {
    if (h.querySelector(".line")) return;
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((l) => lineWrap(l.trim())).join("");
  });

  $("#stats").innerHTML = S.stats
    .map((s) => `<div class="stat"><dt class="mono">${esc(s.label)}</dt><dd data-count="${esc(s.value)}">${esc(s.value)}</dd></div>`)
    .join("");

  $("#about-text").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#skills").innerHTML = S.skills.map((s, i) => `<li><span>${pad(i + 1)}</span>${esc(s)}</li>`).join("");

  const categories = ["All", ...new Set(S.works.map((w) => w.category))];
  $("#filters").innerHTML = categories
    .map((c, i) => `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${esc(c)}" data-cursor="Filter">${esc(c)}</button>`)
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
          <h3 class="project__title">${
            w.link ? `<a href="${esc(w.link)}" target="_blank" rel="noopener" data-cursor="View">${words(w.title)}</a>` : words(w.title)
          }</h3>
          ${w.image ? `<img class="project__img" src="${esc(w.image)}" alt="${esc(w.title)}" loading="lazy" />` : ""}
          <div class="project__foot">
            <ul class="tags mono">${w.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            ${w.link ? `<a class="explore mono magnetic" href="${esc(w.link)}" target="_blank" rel="noopener" data-cursor="View">Explore project <span>↗</span></a>` : ""}
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
        <a href="#contact" class="btn${p.featured ? " btn--accent" : ""}" data-inquiry="student" data-program="${esc(p.title)}" data-cursor="Enroll">Enroll now <span>↗</span></a>
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
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-cursor="Follow">${esc(s.label)} ↗</a></li>`)
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

  /* ---------- Motion (GSAP) ---------- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!window.gsap || reduceMotion) {
    document.documentElement.classList.add("no-motion");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("has-motion");

  /* Custom cursor: a trailing ring that grows into a labelled disc over interactive elements. */
  if (finePointer) {
    const cursor = $(".cursor");
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;
    addEventListener("pointermove", (e) => {
      moveX(e.clientX);
      moveY(e.clientY);
      if (!shown) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
    });
    document.addEventListener("pointerleave", () => {
      gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
      shown = false;
    });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.dataset.label = t ? t.dataset.cursor : "";
      cursor.classList.toggle("is-active", !!t);
    });
    addEventListener("pointerdown", () => gsap.to(cursor, { scale: 0.8, duration: 0.15 }));
    addEventListener("pointerup", () => gsap.to(cursor, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }));

    /* Magnetic links & buttons */
    $$(".magnetic").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
      });
    });
  }

  /* Line drawing helper for SVG paths */
  const prepPath = (p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    return len;
  };

  /* Intro */
  const heroPath = $(".hero__line path");
  prepPath(heroPath);
  gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .from(".nav", { yPercent: -100, autoAlpha: 0, duration: 1 })
    .from("#headline .line__in", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
    .to(heroPath, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.3)
    .from(".hero__line circle", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 2.1)
    .from(".hero__foot > *", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.8);

  // Headline drifts and fades as the hero scrolls away.
  gsap.to("#headline", {
    yPercent: -18,
    autoAlpha: 0.25,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__line", {
    yPercent: 25,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* Scroll progress thread */
  gsap.to(".thread__fill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  /* Section headings: masked line reveals */
  $$("h2.display").forEach((h) =>
    gsap.from($$(".line__in", h), {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 85%" },
    })
  );

  /* Kickers & body copy */
  gsap.utils.toArray(".kicker, .body-lg, .muted-sm").forEach((el) =>
    gsap.from(el, { y: 30, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } })
  );

  /* Stats count up */
  $$("[data-count]").forEach((dd) => {
    const m = dd.dataset.count.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[2].replace(/,/g, ""));
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: dd, start: "top 90%" },
      onUpdate: () => (dd.textContent = m[1] + Math.round(obj.v).toLocaleString() + m[3]),
    });
  });
  gsap.from(".stat", {
    y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".stats", start: "top 88%" },
  });

  /* Rule-line lists */
  const batchIn = (selector, vars = {}) =>
    ScrollTrigger.batch(selector, {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.from(els, { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out", ...vars }),
    });
  batchIn(".skills li", { y: 20, duration: 0.7, stagger: 0.04 });
  batchIn(".row");
  batchIn(".program", { y: 60, stagger: 0.12 });
  batchIn(".quote");
  batchIn(".tags li", { y: 12, duration: 0.6, stagger: 0.05 });

  /* Process: accent line draws across, then steps pop in */
  const process = $(".process");
  gsap
    .timeline({ scrollTrigger: { trigger: process, start: "top 80%" } })
    .fromTo(process, { "--draw": 0 }, { "--draw": 1, duration: 1.2, ease: "power2.inOut" })
    .from($$(".node", process), { scale: 0, duration: 0.5, stagger: 0.15, ease: "back.out(3)" }, 0.2)
    .from($$("li > :not(.node)", process), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" }, 0.3);

  /* Projects: words rise in, title drifts sideways with scroll */
  $$(".project").forEach((proj) => {
    const title = $(".project__title", proj);
    gsap.from($$(".word__in", title), {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 85%" },
    });
    gsap.fromTo(
      title,
      { xPercent: 2 },
      { xPercent: -2, ease: "none", scrollTrigger: { trigger: proj, start: "top bottom", end: "bottom top", scrub: true } }
    );
    gsap.from($$(".project__top > *, .project__foot > *", proj), {
      y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: proj, start: "top 75%" },
    });
  });

  /* Big CTA links underline draws in */
  $$(".big-link").forEach((a) =>
    gsap.from(a, {
      y: 40, autoAlpha: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: a, start: "top 92%" },
    })
  );

  /* Contact squiggle draws with scroll */
  const contactPath = $(".contact__line path");
  prepPath(contactPath);
  gsap.to(contactPath, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: { trigger: ".contact", start: "top 80%", end: "center center", scrub: 1 },
  });
  gsap.from(".form", {
    y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out",
    scrollTrigger: { trigger: ".form", start: "top 85%" },
  });

  // Filtering changes page height; keep trigger positions accurate.
  $("#filters").addEventListener("click", () => requestAnimationFrame(() => ScrollTrigger.refresh()));
  addEventListener("load", () => ScrollTrigger.refresh());
})();
