package com.jobfit.backend_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {

    @Value("${huggingface.api.key}")
    private String hfApiKey;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String HF_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions";

    // ✅ Méthode existante — analyse générale du CV
    public String analyzeJob(String cvContent, String jobDescription) {

        String prompt = "Tu es un expert RH. Analyse ce CV.\n" +
                "CV: " + cvContent.substring(0, Math.min(cvContent.length(), 2000)) + "\n" +
                "Offre: " + jobDescription.substring(0, Math.min(jobDescription.length(), 500)) + "\n\n" +
                "Réponds UNIQUEMENT avec ce JSON exact, sans texte avant ni après :\n" +
                "{\n" +
                "  \"score\": 85,\n" +
                "  \"status\": \"Bon profil\",\n" +
                "  \"skills\": [\"Java\", \"Python\", \"React\"],\n" +
                "  \"recommendations\": [\n" +
                "    {\"type\": \"strength\", \"text\": \"Point fort du CV\"},\n" +
                "    {\"type\": \"improvement\", \"text\": \"Point à améliorer\"}\n" +
                "  ]\n" +
                "}";

        return callHuggingFace(prompt, "{\n" +
                "  \"score\": 72,\n" +
                "  \"status\": \"Analyse simulée\",\n" +
                "  \"skills\": [\"Java\", \"Spring Boot\", \"React\"],\n" +
                "  \"recommendations\": [\n" +
                "    {\"type\": \"strength\", \"text\": \"CV bien structuré et lisible.\"},\n" +
                "    {\"type\": \"strength\", \"text\": \"Expériences professionnelles pertinentes.\"},\n" +
                "    {\"type\": \"improvement\", \"text\": \"Ajoutez plus de mots-clés techniques.\"},\n" +
                "    {\"type\": \"improvement\", \"text\": \"Quantifiez vos réalisations (ex: +30% performance).\"}\n" +
                "  ]\n" +
                "}");
    }

    // ✅ NOUVELLE méthode — boost CV vs offre spécifique
    public String boostCV(String cvContent, String jobTitle, String jobDescription, String jobCompany) {

        String prompt = "Tu es un expert en recrutement. Compare ce CV avec cette offre d'emploi et donne des conseils TRÈS PRÉCIS et CONCRETS pour améliorer la compatibilité.\n\n" +
                "CV du candidat:\n" + cvContent.substring(0, Math.min(cvContent.length(), 2000)) + "\n\n" +
                "Offre d'emploi:\n" +
                "Titre: " + jobTitle + "\n" +
                "Entreprise: " + jobCompany + "\n" +
                "Description: " + jobDescription.substring(0, Math.min(jobDescription.length(), 1000)) + "\n\n" +
                "Donne des conseils ULTRA PRÉCIS comme:\n" +
                "- Quelle compétence spécifique ajouter\n" +
                "- Quelle ligne du CV modifier et comment\n" +
                "- Quel mot-clé de l'offre manque dans le CV\n\n" +
                "Réponds UNIQUEMENT avec ce JSON exact, sans texte avant ni après :\n" +
                "{\n" +
                "  \"tips\": [\n" +
                "    {\"type\": \"add\", \"text\": \"Ajoutez la compétence Docker qui apparaît 3 fois dans l'offre\"},\n" +
                "    {\"type\": \"modify\", \"text\": \"Remplacez 'développé une application' par 'architecturé et déployé une application React avec 10k utilisateurs'\"},\n" +
                "    {\"type\": \"add\", \"text\": \"Mentionnez votre expérience avec les méthodes Agile/Scrum demandées dans l'offre\"}\n" +
                "  ]\n" +
                "}";

        return callHuggingFace(prompt, "{\n" +
                "  \"tips\": [\n" +
                "    {\"type\": \"add\", \"text\": \"Ajoutez les compétences techniques mentionnées dans l'offre.\"},\n" +
                "    {\"type\": \"modify\", \"text\": \"Quantifiez vos expériences avec des chiffres concrets.\"},\n" +
                "    {\"type\": \"add\", \"text\": \"Mentionnez les outils et technologies spécifiques de l'offre.\"}\n" +
                "  ]\n" +
                "}");
    }

    // ✅ Méthode commune pour appeler HuggingFace
    private String callHuggingFace(String prompt, String fallback) {

        Map<String, Object> requestBody = Map.of(
            "model", "meta-llama/llama-3.1-8b-instruct",
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            ),
            "max_tokens", 800
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(hfApiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String rawResponse = restTemplate.postForObject(HF_URL, entity, String.class);

            JsonNode root = objectMapper.readTree(rawResponse);
            String text = root
                .path("choices").get(0)
                .path("message")
                .path("content")
                .asText();

            System.out.println("✅ HuggingFace réponse reçue");
            return text;

        } catch (Exception e) {
            System.err.println("❌ Erreur HuggingFace: " + e.getMessage());
            return fallback;
        }
    }
}