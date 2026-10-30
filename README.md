# Portfolio · Consulting · Mentorship

A fast, dependency-free personal website to showcase your work, sell consultancy services and enroll students.

## Sections
- **Hero** with headline stats
- **About** + skills
- **Portfolio** with category filters
- **Consultancy** services, pricing, process and call-to-action
- **Student programs** (mentorship, bootcamp, self-paced course) with "Enroll now"
- **Testimonials**
- **Contact form** with *client* / *student* tabs (Enroll / Book buttons pre-select the right tab)
- Light/dark mode, mobile menu, scroll animations

## Customise
All content lives in **`js/content.js`** — edit your name, email, socials, projects, services, programs and testimonials there. No HTML changes needed.

- Add a project image: set `image: "images/my-project.jpg"` on a work item.
- Receive form submissions: create a free form at [Formspree](https://formspree.io) (or similar) and paste the URL into `formEndpoint`. If left empty, the form opens the visitor's email app addressed to you.

## Run locally
Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## Deploy
It's a static site — deploy with GitHub Pages (Settings → Pages → deploy from branch), Netlify or Vercel.
