// Copy/adapt these functions into your existing script.js.
// Keep your existing design and event listeners; connect your UI to these API calls.
const API_BASE = "http://localhost:8080/api";

async function sendCareerCoachMessage(message) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Chat request failed");
  return data.reply;
}

async function analyzeResumePdf(file, targetRole = "Software Engineer") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("targetRole", targetRole);
  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Resume analysis failed");
  return data;
}

async function loadJobMatches(skill = "") {
  const response = await fetch(`${API_BASE}/jobs?skill=${encodeURIComponent(skill)}`);
  if (!response.ok) throw new Error("Could not load jobs");
  return response.json();
}

async function generateRoadmap(goal, skills) {
  const response = await fetch(`${API_BASE}/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, skills })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Roadmap request failed");
  return data.roadmap;
}
