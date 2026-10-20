package com.careerly.controller;

import com.careerly.service.AiService;
import jakarta.validation.constraints.NotBlank;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final AiService aiService;

    public ApiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "ok", "service", "Careerly.ai backend");
    }

    public record ChatRequest(@NotBlank String message) {}

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody ChatRequest request) {
        return Map.of("reply", aiService.ask(request.message()));
    }

    @PostMapping(value = "/resume/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> analyzeResume(@RequestParam("file") MultipartFile file,
                                             @RequestParam(value = "targetRole", required = false, defaultValue = "Software Engineer") String targetRole) {
        if (file.isEmpty()) throw new IllegalArgumentException("Please choose a PDF resume.");
        if (file.getSize() > 8 * 1024 * 1024) throw new IllegalArgumentException("PDF must be 8 MB or smaller.");
        if (file.getOriginalFilename() == null || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Please upload a PDF file.");
        }
        try {
            byte[] bytes = file.getBytes();
            String resumeText;
            try (var pdf = Loader.loadPDF(bytes)) {
                resumeText = new PDFTextStripper().getText(pdf);
            }
            if (resumeText.isBlank()) throw new IllegalArgumentException("No readable text found. Upload a text-based PDF, not a scanned image.");
            String prompt = "Analyze this resume for target role: " + targetRole +
                    ". Return: overall score out of 100 (clearly label as an estimate), strengths, missing keywords, concrete improvements, and a 7-day action plan. Be honest and do not assume missing details. Resume text:\n" +
                    resumeText.substring(0, Math.min(resumeText.length(), 12000));
            String analysis = aiService.ask(prompt);
            return Map.of("filename", file.getOriginalFilename(),
                    "targetRole", targetRole,
                    "analysis", analysis,
                    "note", "AI-generated guidance is an estimate, not a guarantee of ATS results or employment.");
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Could not read the PDF. Please try another PDF resume.");
        }
    }

    @GetMapping("/jobs")
    public List<Map<String, Object>> jobs(@RequestParam(value = "skill", required = false, defaultValue = "") String skill) {
        List<Map<String, Object>> jobs = List.of(
                Map.of("title", "Junior Java Developer", "company", "Sample employer", "skills", List.of("Java", "OOP", "SQL", "Spring Boot"), "level", "Entry level", "source", "Demo listing — verify before applying"),
                Map.of("title", "Backend Developer Intern", "company", "Sample employer", "skills", List.of("Java", "REST API", "Git", "SQL"), "level", "Internship", "source", "Demo listing — verify before applying"),
                Map.of("title", "Full Stack Developer", "company", "Sample employer", "skills", List.of("Java", "HTML", "CSS", "JavaScript"), "level", "Entry level", "source", "Demo listing — verify before applying")
        );
        if (skill.isBlank()) return jobs;
        String query = skill.toLowerCase();
        return jobs.stream().filter(j -> ((List<?>) j.get("skills")).stream()
                .anyMatch(s -> s.toString().toLowerCase().contains(query))
                || j.get("title").toString().toLowerCase().contains(query)).toList();
    }

    @PostMapping("/roadmap")
    public Map<String, String> roadmap(@RequestBody Map<String, String> request) {
        String goal = request.getOrDefault("goal", "Become a software engineer");
        String skills = request.getOrDefault("skills", "Beginner");
        return Map.of("roadmap", aiService.ask("Create a realistic 4-week career roadmap. Goal: " + goal +
                ". Current skills: " + skills + ". Give weekly milestones, daily practice, and measurable outputs."));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
    public Map<String, String> badRequest(IllegalArgumentException ex) {
        return Map.of("error", ex.getMessage());
    }
}
