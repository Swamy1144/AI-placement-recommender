package com.career.navigator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CareerNavigatorApp {
    public static void main(String[] args) {
        SpringApplication.run(CareerNavigatorApp.class, args);
    }

    @GetMapping("/api/status")
    public String getStatus() {
        return "SUCCESS: SVU Career Navigator Backend is LIVE";
    }
}