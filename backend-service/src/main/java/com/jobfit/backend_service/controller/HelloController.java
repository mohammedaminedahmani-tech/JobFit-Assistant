package com.jobfit.backend_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String sayHello() {
        return "Bonjour Adam ! Le Backend Java est pret pour le projet JobFit.";
    }
}