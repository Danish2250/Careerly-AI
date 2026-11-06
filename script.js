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

function makeCoachReply(message) {
  const lower = message.toLowerCase();

  if (/build a java plan|java plan|learn java|java roadmap/.test(lower)) {
    return `JAVA LEARNING PLAN

1. Core Java
   Learn variables, data types, operators, loops, arrays and methods.

2. Object-Oriented Programming
   Understand classes, objects, constructors, inheritance, polymorphism, abstraction and encapsulation.

3. Important Java concepts
   Practise strings, exception handling, collections, generics and file handling.

4. DSA with Java
   Start with arrays and strings, then sorting, searching, linked lists, stacks, queues, trees and graphs.

5. Build projects
   Create a Student Management System or Expense Tracker using Java and a database.

6. Daily practice
   Code for 60–90 minutes and solve 1–2 problems. Review mistakes every weekend.

TODAY'S TASK: Write 3 small Java programs using loops and arrays.`;
  }

  if (/placement prep|placement preparation|prepare for placement|placement/.test(lower)) {
    return `PLACEMENT PREPARATION PLAN

1. Programming
   Strengthen Core Java, OOP, strings, arrays and collections.

2. DSA
   Practise arrays, strings, hash maps, sorting, searching, linked lists and trees.

3. Computer Science subjects
   Revise DBMS, SQL, Operating Systems and Computer Networks.

4. Aptitude
   Practise quantitative aptitude, logical reasoning and verbal ability.

5. Projects
   Prepare a clear explanation of your Careerly.ai project, tech stack, features and your contribution.

6. Resume and GitHub
   Keep your resume to one page, add working project links and write clear READMEs.

7. Interview practice
   Prepare your introduction, project explanation and common Java questions. Take one mock interview each week.

TODAY'S TASK: Solve 2 array problems and revise one OOP concept.`;
  }

  if (/improve my projects|improve project|project improvement|portfolio|github/.test(lower)) {
    return `PROJECT IMPROVEMENT CHECKLIST

1. Improve the UI
   Make every page responsive, consistent and easy to use on mobile and desktop.

2. Make features work
   Test every button, form, filter and navigation link. Remove placeholder actions.

3. Connect the backend
   Integrate the frontend with your Spring Boot REST APIs and show loading and error states.

4. Add database support
   Store user accounts and relevant project data persistently instead of relying only on demo data.

5. Add authentication
   Implement secure registration, login and protected pages if the project needs user accounts.

6. Improve reliability
   Validate inputs, handle API failures and never expose API keys in frontend code.

7. Polish GitHub
   Add screenshots, setup instructions, feature descriptions and a clear README.

8. Demonstrate honestly
   Clearly label demo features and only describe AI functionality as live when it is connected to a real AI service.

TODAY'S TASK: Test one complete user journey in Careerly.ai and write down the first 3 issues you find.`;
  }

  if (/salary|lpa|package/.test(lower)) {
    return `PLACEMENT READINESS PLAN

1. Build strong programming fundamentals.
2. Practise DSA consistently.
3. Revise DBMS, OS and Computer Networks.
4. Complete and explain one polished project.
5. Practise aptitude and communication.
6. Apply to suitable fresher roles and track applications.

TODAY'S TASK: Choose one topic you find difficult and practise it for 45 minutes.`;
  }

  return `LET'S MAKE A PRACTICAL PLAN

1. Choose your target role.
2. List the skills you already know.
3. Identify one important skill gap.
4. Set a small weekly goal.
5. Complete one practical task today.

Tell me your target role and current skill level, and I can make the plan more specific.

Note: These are built-in Careerly AI demo responses, not live AI-generated answers.`;
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


// Cinematic preloader: short, reliable and reduced-motion aware.
(() => {
  const preloader = document.getElementById("cinematic-preloader");
  if (!preloader) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("load", () => {
    window.setTimeout(() => preloader.classList.add("is-hidden"), reduced ? 80 : 1250);
    window.setTimeout(() => preloader.remove(), reduced ? 250 : 2200);
  }, { once: true });
  window.setTimeout(() => {
    if (preloader.isConnected) preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 900);
  }, 3500);
})();
