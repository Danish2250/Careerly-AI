
"use strict";

const pages = {
  overview: "Overview",
  resume: "Resume Analyzer",
  coach: "AI Career Coach",
  jobs: "Job Matches",
  roadmap: "Skill Roadmap"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const toast = $("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function showPage(name) {
  if (!pages[name]) return;

  $$(".page").forEach((page) => {
    page.classList.toggle("active-page", page.id === `page-${name}`);
  });

  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === name);
  });

  const title = $("#crumbTitle");
  if (title) title.textContent = pages[name];

  const sidebar = $("#sidebar");
  if (sidebar) sidebar.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initializeNavigation() {
  $$("[data-page]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const name = button.dataset.page;
      if (!pages[name]) return;

      event.preventDefault();
      showPage(name);
    });
  });

  const menuBtn = $("#menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      $("#sidebar")?.classList.toggle("open");
    });
  }

  $("#notificationBtn")?.addEventListener("click", () => {
    showToast("You're all caught up!");
  });

  $("#profileBtn")?.addEventListener("click", () => {
    showToast("Profile settings are a demo feature.");
  });
}

function initializeDate() {
  const label = $("#todayLabel");
  if (label) {
    label.textContent = new Date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }
}

function initializeResumeAnalyzer() {
  const analyzeBtn = $("#analyzeBtn");
  if (!analyzeBtn) return;

  analyzeBtn.addEventListener("click", () => {
    const resumeInput = $("#resumeText");
    const roleInput = $("#targetRole");
    const text = resumeInput?.value.trim() || "";
    const role = roleInput?.value.trim() || "your target role";

    if (text.length < 40) {
      showToast("Please paste more resume text first.");
      resumeInput?.focus();
      return;
    }

    const checks = [
      {
        title: "Skills and keywords",
        ok: /java|python|javascript|sql|react|spring|html|css|api|git|aws/i.test(text),
        good: "Technical skills were detected.",
        improve: `Add relevant technical skills for ${role}.`
      },
      {
        title: "Projects and impact",
        ok: /project|built|developed|created|implemented|designed/i.test(text),
        good: "Project experience was detected.",
        improve: "Add projects and explain the tools and results."
      },
      {
        title: "Practical experience",
        ok: /intern|experience|worked|responsible|contributed|volunteer/i.test(text),
        good: "Practical experience was detected.",
        improve: "Mention internships, coursework, or team contributions."
      },
      {
        title: "Measurable results",
        ok: /\d+%|\d+\+|\d+\s+users|\d+\s+records|\d+\s+projects/i.test(text),
        good: "Measurable results were detected.",
        improve: "Add truthful numbers to show your impact."
      },
      {
        title: "Education",
        ok: /education|bachelor|btech|degree|university|college|certification/i.test(text),
        good: "Education details were detected.",
        improve: "Clearly mention your degree and graduation year."
      }
    ];

    const score = Math.round(
      checks.filter((item) => item.ok).length / checks.length * 100
    );

    if ($("#scoreValue")) $("#scoreValue").textContent = score;
    if ($("#scoreRing")) {
      $("#scoreRing").style.background =
        `conic-gradient(#a78bfa ${score * 3.6}deg, #30283f 0deg)`;
    }

    if ($("#resumeStatus")) {
      $("#resumeStatus").textContent = "Demo review complete";
    }

    if ($("#scoreHeadline")) {
      $("#scoreHeadline").textContent =
        score >= 80 ? "A solid starting point" :
        score >= 60 ? "You're building a good base" :
        "A few focused updates can help";
    }

    if ($("#scoreDescription")) {
      $("#scoreDescription").textContent =
        `Checklist review for ${role}. This is a demo score, not an official ATS score.`;
    }

    const list = $("#insightList");
    if (list) {
      list.replaceChildren();

      checks.forEach((item) => {
        const row = document.createElement("div");
        row.className = "insight-item";

        const icon = document.createElement("span");
        icon.className = "insight-check";
        icon.textContent = item.ok ? "✓" : "↗";

        const content = document.createElement("div");
        const heading = document.createElement("strong");
        heading.textContent = item.title;
        content.append(heading, document.createTextNode(
          " " + (item.ok ? item.good : item.improve)
        ));

        row.append(icon, content);
        list.appendChild(row);
      });
    }

    showToast("Resume review completed!");
  });
}

const coachingRules = [
  {
    keys: ["java", "dsa", "developer", "programming"],
    response: "Learn Core Java and OOP first. Then practise DSA, SQL, Git, and build one Java project. Practise consistently and explain your code clearly."
  },
  {
    keys: ["placement", "interview", "job", "resume"],
    response: "For fresher placements, focus on Java, OOP, DBMS, operating systems, networking, DSA, and one polished project. Practise interview questions and explaining your project."
  },
  {
    keys: ["project", "portfolio", "github"],
    response: "Build a project that solves a clear problem. Add a README, screenshots, setup instructions, meaningful commits, and input validation."
  },
  {
    keys: ["roadmap", "plan", "routine", "30-day", "daily"],
    response: "Try a weekly routine: four days for learning and coding, one day for a project, one day for revision, and one lighter review day."
  },
  {
    keys: ["salary", "lpa", "package"],
    response: "Improve your programming, DSA, project quality, communication, and interview skills. Compare jobs by learning opportunities, responsibilities, and salary."
  }
];

function makeCoachReply(message) {
  const lower = message.toLowerCase();
  const rule = coachingRules.find((item) =>
    item.keys.some((key) => lower.includes(key))
  );

  return rule
    ? rule.response
    : "Tell me your target job, current skills, and main difficulty. I can help you make a practical career plan. This is a local demo response.";
}

function addMessage(text, who) {
  const messages = $("#chatMessages");
  if (!messages) return;

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
    label.textContent = "CAREERLY AI";
    bubble.appendChild(label);
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.appendChild(paragraph);

  row.append(avatar, bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

async function getCoachResponse(message) {
  try {
    const response = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error("Backend HTTP " + response.status);
    }

    const data = await response.json();
    const reply = data.reply || data.response || data.message;

    if (typeof reply === "string" && reply.trim()) {
      return reply;
    }

    throw new Error("No reply text in backend response");
  } catch (error) {
    console.warn("Using local demo response:", error);
    return makeCoachReply(message) +
      "\n\n(Local demo response: backend connection unavailable.)";
  }
}

let isSendingPrompt = false;

async function sendPrompt(text) {
  const message = String(text || "").trim();
  if (!message || isSendingPrompt) return;

  addMessage(message, "user");

  const input = $("#chatInput");
  if (input) input.value = "";

  isSendingPrompt = true;
  const sendButton = $('#chatForm button[type="submit"]');
  if (sendButton) sendButton.disabled = true;

  try {
    const reply = await getCoachResponse(message);
    addMessage(reply, "assistant");
  } catch (error) {
    console.error(error);
    addMessage("Sorry, something went wrong. Please try again.", "assistant");
  } finally {
    isSendingPrompt = false;
    if (sendButton) sendButton.disabled = false;
    input?.focus();
  }
}

function initializeCoach() {
  $("#chatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    sendPrompt($("#chatInput")?.value || "");
  });

  $$("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage("coach");
      sendPrompt(button.dataset.prompt || "");
    });
  });

  $("#clearChatBtn")?.addEventListener("click", () => {
    const messages = $("#chatMessages");
    if (messages) messages.replaceChildren();

    addMessage("Chat cleared. What would you like to work on next?", "assistant");
    showToast("Conversation cleared.");
  });
}

function initializeJobs() {
  const search = $("#jobSearch");
  const level = $("#jobLevel");
  const grid = $("#jobGrid");

  if (!search || !level || !grid) return;

  function filterJobs() {
    const query = search.value.toLowerCase().trim();
    const selectedLevel = level.value;
    let visible = 0;

    $$(".job-card", grid).forEach((card) => {
      const content =
        `${card.dataset.title || ""} ${card.dataset.skills || ""} ${card.textContent}`.toLowerCase();

      const matches = content.includes(query) &&
        (selectedLevel === "all" || card.dataset.level === selectedLevel);

      card.hidden = !matches;
      if (matches) visible++;
    });

    let empty = $("#noJobs");

    if (visible === 0 && !empty) {
      empty = document.createElement("div");
      empty.id = "noJobs";
      empty.className = "panel";
      empty.textContent = "No sample roles match. Try another search.";
      grid.appendChild(empty);
    } else if (visible > 0 && empty) {
      empty.remove();
    }
  }

  search.addEventListener("input", filterJobs);
  level.addEventListener("change", filterJobs);

  $$(".save-job").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.classList.toggle("saved");

      button.innerHTML = saved
        ? 'Saved <span>✓</span>'
        : 'Save role <span>＋</span>';

      showToast(saved ? "Job saved." : "Job removed from saved state.");
    });
  });
}

function initializeRoadmap() {
  const items = $$(".roadmap-item");
  const progressText = $("#progressText");
  const progressBar = $("#progressBar");

  function updateProgress() {
    const done = items.filter((item) =>
      item.classList.contains("complete")
    ).length;

    if (progressText) {
      progressText.textContent = `${done} of ${items.length} complete`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${items.length ? done / items.length * 100 : 0}%`;
    }
  }

  items.forEach((item) => {
    const button = $(".milestone-check", item);
    const status = $(".milestone-status", item);

    if (!button) return;

    button.addEventListener("click", () => {
      const complete = item.classList.toggle("complete");

      if (status) {
        status.textContent = complete ? "Completed" : "Not started";
      }

      button.setAttribute("aria-pressed", String(complete));
      updateProgress();

      showToast(
        complete ? "Milestone completed!" : "Milestone marked as not started."
      );
    });
  });

  updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeNavigation();
    initializeDate();
    initializeResumeAnalyzer();
    initializeCoach();
    initializeJobs();
    initializeRoadmap();

    console.log("Careerly.ai script loaded successfully.");
  } catch (error) {
    console.error("Careerly.ai initialization error:", error);
    showToast("Some features failed. Check the browser Console.");
  }
});
