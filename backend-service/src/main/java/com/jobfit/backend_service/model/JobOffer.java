package com.jobfit.backend_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonIgnoreProperties(ignoreUnknown = true) // ignore tout champ JSON inutile
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID généré automatiquement par H2

    private String scrapedId; // facultatif si tu veux stocker un id externe

    private String title;

    private String company;

    private String location;

    @Column(length = 5000)
    private String description;

    private String link;
}