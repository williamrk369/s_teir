/*
 * ============================================================
 *  SITE CONTENT — edit this file to personalise the website.
 *  Everything on the page (name, works, services, programs,
 *  testimonials, contact details) is rendered from here.
 * ============================================================
 */
window.SITE = {
  name: "Your Name",
  role: "Designer · Developer · Consultant · Mentor",
  /* Giant hero headline — one line per entry. The last line is highlighted. */
  headline: ["I build", "products", "that work."],
  /* Closing call-to-action above the contact form. */
  closing: ["Have an idea", "worth building?"],
  tagline:
    "I build thoughtful digital products, help teams ship with confidence, and mentor the next generation of creators.",
  location: "Available worldwide · Remote & on-site",
  email: "hello@example.com",

  /* Optional: a form endpoint (e.g. https://formspree.io/f/xxxxxxx).
     Leave empty and the forms will open the visitor's email app instead. */
  formEndpoint: "",

  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "X / Twitter", url: "https://x.com/" },
  ],

  stats: [
    { value: "8+", label: "Years experience" },
    { value: "60+", label: "Projects delivered" },
    { value: "25+", label: "Consulting clients" },
    { value: "300+", label: "Students mentored" },
  ],

  about: [
    "I'm a multidisciplinary professional working at the intersection of design, engineering and strategy. Over the years I've partnered with startups, agencies and established companies to turn ideas into products people actually use.",
    "Alongside client work, I teach. I believe the fastest way to master a craft is to learn it from someone who practises it every day — so my programs are hands-on, project-based and built around real-world work.",
  ],

  skills: [
    "Product Strategy", "UI/UX Design", "Web Development", "JavaScript / TypeScript",
    "React", "Python", "Data Analysis", "Branding", "Technical Writing", "Team Leadership",
  ],

  /* Portfolio — `category` drives the filter buttons. */
  works: [
    {
      title: "Fintech Dashboard",
      category: "Web App",
      year: "2026",
      description: "A real-time analytics dashboard for a payments startup, cutting reporting time by 70%.",
      tags: ["React", "D3", "Node"],
      link: "#",
      color: "#6c5ce7",
    },
    {
      title: "Health Tracker App",
      category: "Mobile",
      year: "2025",
      description: "Cross-platform habit and wellness tracker with 40k+ downloads in its first quarter.",
      tags: ["React Native", "Firebase"],
      link: "#",
      color: "#00b894",
    },
    {
      title: "Brand Identity — Nova Labs",
      category: "Design",
      year: "2025",
      description: "Complete visual identity, design system and marketing site for an AI research lab.",
      tags: ["Branding", "Figma"],
      link: "#",
      color: "#e17055",
    },
    {
      title: "E-commerce Replatform",
      category: "Consulting",
      year: "2024",
      description: "Led the technical strategy to migrate a retailer to a headless stack; conversion up 32%.",
      tags: ["Strategy", "Architecture"],
      link: "#",
      color: "#0984e3",
    },
    {
      title: "Learning Platform",
      category: "Web App",
      year: "2024",
      description: "Course platform with video lessons, quizzes and progress tracking for 5,000+ learners.",
      tags: ["Next.js", "PostgreSQL"],
      link: "#",
      color: "#fdcb6e",
    },
    {
      title: "Data Insights Report",
      category: "Consulting",
      year: "2023",
      description: "Customer churn analysis and retention playbook for a SaaS company.",
      tags: ["Python", "Analytics"],
      link: "#",
      color: "#d63031",
    },
  ],

  /* Consultancy services */
  services: [
    {
      icon: "🧭",
      title: "Strategy & Discovery",
      description: "Clarify goals, map users and define a roadmap before a single line of code is written.",
      price: "From $500",
    },
    {
      icon: "🛠️",
      title: "Product Design & Build",
      description: "End-to-end design and development of websites, web apps and MVPs.",
      price: "Project-based",
    },
    {
      icon: "🔍",
      title: "Audits & Code Reviews",
      description: "In-depth review of UX, performance, accessibility and code quality with an action plan.",
      price: "From $350",
    },
    {
      icon: "🤝",
      title: "Advisory Retainer",
      description: "Ongoing access to an experienced advisor for your team — calls, reviews and async support.",
      price: "Monthly",
    },
  ],

  process: [
    { step: "01", title: "Free intro call", text: "30 minutes to understand your goals and see if we're a fit." },
    { step: "02", title: "Proposal", text: "A clear scope, timeline and fixed quote — no surprises." },
    { step: "03", title: "Delivery", text: "Regular check-ins and transparent progress until launch." },
    { step: "04", title: "Support", text: "Hand-over, documentation and optional ongoing support." },
  ],

  /* Student programs */
  programs: [
    {
      title: "1:1 Mentorship",
      level: "All levels",
      duration: "Monthly",
      price: "$149 / month",
      features: ["4 × 60-min live sessions", "Personal learning roadmap", "Portfolio & CV review", "Chat support between sessions"],
      featured: false,
    },
    {
      title: "Bootcamp Cohort",
      level: "Beginner → Intermediate",
      duration: "12 weeks",
      price: "$799",
      features: ["Live group classes twice a week", "3 real-world capstone projects", "Code reviews & feedback", "Certificate of completion", "Career guidance"],
      featured: true,
    },
    {
      title: "Self-paced Course",
      level: "Beginner",
      duration: "Lifetime access",
      price: "$99",
      features: ["40+ video lessons", "Exercises & quizzes", "Community access", "Learn at your own pace"],
      featured: false,
    },
  ],

  testimonials: [
    {
      quote: "Exceptional work from strategy to launch. Our product finally feels as good as we imagined it.",
      name: "Sarah K.",
      role: "Founder, Fintech startup",
    },
    {
      quote: "The bootcamp changed my career. I landed my first developer job two months after finishing.",
      name: "Daniel M.",
      role: "Former student, now Junior Developer",
    },
    {
      quote: "Clear, honest advice and a reviewer who genuinely cares. Our team levelled up quickly.",
      name: "Priya R.",
      role: "Engineering Manager",
    },
  ],
};
