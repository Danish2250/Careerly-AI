# Careerly.ai Spring Boot Backend Starter

This starter backend exposes APIs for a Careerly.ai frontend:
- `GET /api/health` — health check
- `POST /api/chat` — AI career coach response
- `POST /api/resume/analyze` — extract text from a PDF and request AI feedback
- `GET /api/jobs?skill=Java` — sample/demo job matches (not live listings)
- `POST /api/roadmap` — AI-generated roadmap

## Requirements
- Java 17 or newer
- Maven 3.9+ (or use the Maven wrapper if you add one)
- Internet access and an API key for real AI responses

## Run on Windows
1. Extract this ZIP.
2. Open the `careerly-ai-backend` folder in VS Code.
3. Open Terminal in that folder.
4. Check Java: `java -version`
5. Check Maven: `mvn -version`
6. Set your AI key for this terminal session (PowerShell):
   `$env:OPENAI_API_KEY="YOUR_API_KEY_HERE"`
7. Start backend: `mvn spring-boot:run`
8. In Chrome, open `http://localhost:8080/api/health`. It should return JSON with `"status":"ok"`.

Never paste your real API key into frontend JavaScript, GitHub, screenshots, or public repositories. Keep it only in the backend environment variable.

## Connect frontend
1. Keep your existing frontend `index.html`, `style.css`, and `script.js`.
2. Copy functions from `frontend-connect-example.js` into your current `script.js`.
3. Connect the existing chat send button to `sendCareerCoachMessage(message)`.
4. Connect the resume upload input to `analyzeResumePdf(file, targetRole)`.
5. Connect the job page to `loadJobMatches(skill)`.
6. Connect roadmap form to `generateRoadmap(goal, skills)`.
7. Render returned strings safely as text (use `textContent`, not `innerHTML` for user/API content).

The sample jobs are placeholders. They are not live vacancies and should not be presented as verified openings.

## Important notes
- Without `OPENAI_API_KEY`, chat/analysis returns a setup message instead of real AI feedback.
- Resume analysis accepts text-based PDFs up to 8 MB. Scanned-image PDFs need OCR, which is not included.
- This is a starter for local development, not production-ready. Before public deployment, add authentication, rate limiting, robust JSON parsing, request logging without sensitive resume text, stronger validation, tests, and privacy/retention controls.
- The backend's CORS setting is permissive for local prototyping. Restrict it to your deployed frontend domain before production.
