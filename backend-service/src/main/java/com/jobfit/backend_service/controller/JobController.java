package com.jobfit.backend_service.controller;

import com.jobfit.backend_service.model.JobOffer;
import com.jobfit.backend_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<JobOffer> getAllJobs() {
        return jobService.getAllSavedJobs();
    }

    @PostMapping
    public JobOffer addJob(@RequestBody JobOffer offer) {
        return jobService.saveJob(offer);
    }

    // ✅ Ajout du paramètre page (défaut = 1)
    @GetMapping("/scrape")
    public List<JobOffer> scrape(
            @RequestParam String q,
            @RequestParam String l,
            @RequestParam(defaultValue = "1") int page) {
        return jobService.scrapeAndSaveJobs(q, l, page);
    }
}