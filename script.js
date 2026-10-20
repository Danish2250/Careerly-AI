const pages = {
  overview: "Overview",
  resume: "Resume Analyzer",
  coach: "AI Career Coach",
  jobs: "Job Matches",
  roadmap: "Skill Roadmap"
};
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function showPage(name) {
  if (!pages[name]) return;
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active-page", page.id === `page-${name}`));
  document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.page === name));
  document.getElementById("crumbTitle").textContent = pages[name];
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", event => {
    const page = button.dataset.page;
    if (page) { event.preventDefault(); showPage(page); }
  });
});
document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("notificationBtn").addEventListener("click", () => showToast("You're all caught up. Your career journey is ready when you are."));
document.getElementById("profileBtn").addEventListener("click", () => showToast("Profile settings are a demo placeholder."));
const today = new Date();
document.getElementById("todayLabel").textContent = today.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("resumeText").value.trim();
  const role = document.getElementById("targetRole").value.trim() || "your target role";
  if (text.length < 40) {
    showToast("Paste a little more resume text first (at least a few sentences).");
    document.getElementById("resumeText").focus();
    return;
  }
  const checks = [
    { title: "Skills and keywords", ok: /java|python|javascript|sql|react|spring|html|css|api|git|machine learning|aws/i.test(text), good: "Relevant technical skills were detected.", improve: "Add a clearly labeled Skills section with tools relevant to " + role + "." },
    { title: "Projects and impact", ok: /project|built|developed|created|implemented|designed/i.test(text), good: "Your text mentions project or build experience.", improve: "Add 1–2 projects and explain what you built, which tools you used, and the result." },
    { title: "Experience or practical work", ok: /intern|experience|worked|responsible|contributed|volunteer/i.test(text), good: "Practical experience signals were found.", improve: "Include internships, volunteering, coursework, or team contributions where relevant." },
    { title: "Measurable results", ok: /\d+%|\d+\+|\d+ users|\d+ records|\d+ projects/i.test(text), good: "At least one measurable result appears in your text.", improve: "Add truthful numbers where possible, such as response time improved or records processed." },
    { title: "Education and credentials", ok: /education|bachelor|b\.tech|btech|degree|university|college|certification/i.test(text), good: "Education or credential details were detected.", improve: "Make your degree, institution, expected graduation, and relevant certifications easy to find." }
  ];
  const score = Math.round((checks.filter(item => item.ok).length / checks.length) * 100);
  document.getElementById("scoreValue").textContent = score;
  document.getElementById("scoreRing").style.background = `conic-gradient(#a78bfa ${score * 3.6}deg,#30283f 0deg)`;
  document.getElementById("resumeStatus").textContent = "Demo review complete";
  document.getElementById("scoreHeadline").textContent = score >= 80 ? "A solid starting point" : score >= 60 ? "You're building a good base" : "A few focused updates can help";
  document.getElementById("scoreDescription").textContent = `A simple checklist review for ${role}. This is not an ATS score or professional assessment.`;
  document.getElementById("insightList").innerHTML = checks.map(item => `
    <div class="insight-item"><span class="insight-check">${item.ok ? "✓" : "↗"}</span><div><strong>${item.title}</strong>${item.ok ? item.good : item.improve}</div></div>
  `).join("");
  showToast("Your local demo resume review is ready.");
});

const coachingRules = [
  { keys: ["java", "dsa", "developer", "programming"], response: "A practical path is: (1) strengthen Core Java and OOP, (2) solve a few DSA problems consistently, (3) learn SQL and Git, (4) build one Java + database project, and (5) practice explaining your code. Start with a realistic 45–60 minute daily block and review progress every week." },
  { keys: ["placement", "interview", "job", "resume"], response: "For fresher placements, focus on three tracks: fundamentals (Java/OOP, DBMS, OS, networking), problem solving (arrays, strings, hash maps, sorting, then trees), and proof of work (one polished project with a clear README). Practice introducing yourself and explaining one project in two minutes." },
  { keys: ["project", "portfolio", "github"], response: "Choose a project that solves a clear problem and is easy to demonstrate. Include a clean README, screenshots, setup instructions, meaningful commits, input validation, and a short list of future improvements. Be ready to explain what you personally built and why you chose the design." },
  { keys: ["roadmap", "plan", "routine", "30-day", "daily"], response: "Try this weekly rhythm: 4 days for learning and coding, 1 day for a small project feature, 1 day for revision or a mock interview, and 1 lighter review day. Keep each session small enough to repeat. You can track milestones in the Skill Roadmap tab." },
  { keys: ["salary", "lpa", "package"], response: "Rather than focusing only on a package number, build evidence of job readiness: core programming, DSA practice, a working project, communication, and interview practice. Compare roles using location, learning opportunities, responsibilities, and compensation together." }
];
function makeCoachReply(message) {
  const lower = message.toLowerCase();
  const found = coachingRules.find(rule => rule.keys.some(key => lower.includes(key)));
  if (found) return found.response;
  return "A good next step is to make your goal specific. Write down the role you want, the skills you already have, and one gap to work on this week. Then choose a small task you can finish today. If you tell me your target role and current skill level, I can suggest a more focused plan. (This is a local demo response, not a live AI model.)";
}
function addMessage(text, who) {
  const messages = document.getElementById("chatMessages");
  const row = document.createElement("div");
  row.className = `message ${who}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = who === "user" ? "D" : "✦";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  if (who === "assistant") {
    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = "CAREERLY AI · DEMO";
    bubble.appendChild(label);
  }
  const p = document.createElement("p");
  p.textContent = text;
  bubble.appendChild(p);
  row.append(avatar, bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
function sendPrompt(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  addMessage(cleaned, "user");
  document.getElementById("chatInput").value = "";
  setTimeout(() => addMessage(makeCoachReply(cleaned), "assistant"), 280);
}
document.getElementById("chatForm").addEventListener("submit", event => {
  event.preventDefault();
  sendPrompt(document.getElementById("chatInput").value);
});
document.querySelectorAll("[data-prompt]").forEach(button => button.addEventListener("click", () => {
  showPage("coach");
  sendPrompt(button.dataset.prompt);
}));
document.getElementById("clearChatBtn").addEventListener("click", () => {
  document.getElementById("chatMessages").innerHTML = "";
  addMessage("Chat cleared. What would you like to work on next?", "assistant");
  showToast("Conversation cleared.");
});

const jobSearch = document.getElementById("jobSearch");
const jobLevel = document.getElementById("jobLevel");
function filterJobs() {
  const query = jobSearch.value.toLowerCase().trim();
  const level = jobLevel.value;
  let visible = 0;
  document.querySelectorAll(".job-card").forEach(card => {
    const text = `${card.dataset.title} ${card.dataset.skills} ${card.textContent}`.toLowerCase();
    const matches = text.includes(query) && (level === "all" || card.dataset.level === level);
    card.hidden = !matches;
    if (matches) visible++;
  });
  const existing = document.getElementById("noJobs");
  if (visible === 0 && !existing) {
    const empty = document.createElement("div");
    empty.id = "noJobs";
    empty.className = "panel";
    empty.textContent = "No sample roles match those filters. Try another keyword or level.";
    document.getElementById("jobGrid").appendChild(empty);
  } else if (visible > 0 && existing) existing.remove();
}
jobSearch.addEventListener("input", filterJobs);
jobLevel.addEventListener("change", filterJobs);
document.querySelectorAll(".save-job").forEach(button => button.addEventListener("click", () => {
  const saved = button.classList.toggle("saved");
  button.innerHTML = saved ? 'Saved <span>✓</span>' : 'Save role <span>＋</span>';
  showToast(saved ? "Role saved in this page session." : "Role removed from saved state.");
}));

const roadmapItems = [...document.querySelectorAll(".roadmap-item")];
function updateRoadmap() {
  const done = roadmapItems.filter(item => item.classList.contains("complete")).length;
  document.getElementById("progressText").textContent = `${done} of ${roadmapItems.length} complete`;
  document.getElementById("progressBar").style.width = `${done / roadmapItems.length * 100}%`;
}
roadmapItems.forEach(item => {
  const button = item.querySelector(".milestone-check");
  button.addEventListener("click", () => {
    const complete = item.classList.toggle("complete");
    item.querySelector(".milestone-status").textContent = complete ? "Completed" : "Not started";
    button.setAttribute("aria-pressed", String(complete));
    updateRoadmap();
    showToast(complete ? "Milestone completed. Nice progress!" : "Milestone marked as not started.");
  });
});
updateRoadmap();
