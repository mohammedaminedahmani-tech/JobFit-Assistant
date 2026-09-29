package com.jobfit.backend_service.service;

import com.jobfit.backend_service.model.JobOffer;
import com.jobfit.backend_service.repository.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JobService {

    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${scraper.url}")
    private String scraperUrl;

    public List<JobOffer> scrapeAndSaveJobs(String query, String location, int page) {

        int limit = 5;
        int offset = (page - 1) * limit;

        String pythonUrl = UriComponentsBuilder
                .fromHttpUrl(scraperUrl + "/search")
                .queryParam("q", query)
                .queryParam("l", location)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .toUriString();

        try {
            JobOffer[] response = restTemplate.getForObject(pythonUrl, JobOffer[].class);

            if (response != null && response.length > 0) {
                // ✅ Retourner directement sans toucher la base
                return Arrays.asList(response);
            }
        } catch (Exception e) {
            System.out.println("Erreur appel Python: " + e.getMessage());
        }

        return List.of();
    }

    public List<JobOffer> getAllSavedJobs() {
        return jobOfferRepository.findAll();
    }

    public JobOffer saveJob(JobOffer offer) {
        return jobOfferRepository.save(offer);
    }
}