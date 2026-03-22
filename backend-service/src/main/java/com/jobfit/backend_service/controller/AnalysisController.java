package com.jobfit.backend_service.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobfit.backend_service.service.GeminiService;
import com.jobfit.backend_service.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalysisController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ Endpoint existant — analyse du CV
    @PostMapping("/cv")
    public ResponseEntity<Map<String, Object>> analyzeCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription) throws IOException {

        String cvText = pdfService.extractText(file);
        String aiResponse = geminiService.analyzeJob(cvText, jobDescription);

        try {
            String jsonContent = extractJson(aiResponse);
            Map<String, Object> result = objectMapper.readValue(jsonContent, new TypeReference<>() {});

            List<String> skills = new ArrayList<>();
            if (result.containsKey("skills")) {
                skills = (List<String>) result.get("skills");
            }

            String mainSkill = skills.isEmpty() ? "développeur" : skills.get(0);
            result.put("mainSkill", mainSkill);
            result.put("allSkills", skills);

            // ✅ Retourner le texte du CV pour le boost
            result.put("cvText", cvText.substring(0, Math.min(cvText.length(), 3000)));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("score", 0);
            error.put("status", "Erreur d'analyse IA");
            error.put("mainSkill", "développeur");
            error.put("allSkills", List.of("développeur"));
            error.put("cvText", "");
            error.put("recommendations", List.of(
                Map.of("type", "improvement", "text", "Erreur de connexion IA.")
            ));
            return ResponseEntity.ok(error);
        }
    }

    // ✅ NOUVEAU endpoint — boost CV vs offre spécifique
    @PostMapping("/boost")
    public ResponseEntity<Map<String, Object>> boostCV(
            @RequestBody Map<String, String> body) {

        String cvText = body.getOrDefault("cvText", "");
        String jobTitle = body.getOrDefault("jobTitle", "");
        String jobDescription = body.getOrDefault("jobDescription", "");
        String jobCompany = body.getOrDefault("jobCompany", "");

        String boostResponse = geminiService.boostCV(cvText, jobTitle, jobDescription, jobCompany);

        try {
            String jsonContent = extractJson(boostResponse);
            Map<String, Object> result = objectMapper.readValue(jsonContent, new TypeReference<>() {});
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("tips", List.of(
                Map.of("type", "modify", "text", "Erreur lors de l'analyse. Réessayez.")
            ));
            return ResponseEntity.ok(error);
        }
    }

    private String extractJson(String input) {
        if (input == null) return "{}";
        String cleaned = input.replaceAll("```json", "").replaceAll("```", "").trim();
        int startIndex = cleaned.indexOf('{');
        int endIndex = cleaned.lastIndexOf('}');
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return cleaned.substring(startIndex, endIndex + 1);
        }
        return cleaned;
    }
}