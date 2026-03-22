package com.jobfit.backend_service.repository;

import com.jobfit.backend_service.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    // Cette interface hérite de toutes les méthodes de base :
    // save(), findAll(), findById(), delete(), etc.
}