package com.example.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Configuration
public class FirebaseInitializer {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseInitializer.class);

    public FirebaseInitializer() {
        try {
            logger.info("Initializing Firebase...");

            // Load the service account key file
            FileInputStream serviceAccount = new FileInputStream(
                    "Backend\\demo\\src\\main\\resources\\serviceAccountKey.json");

            // Set Firebase options using the service account key
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Check if the FirebaseApp has already been initialized
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase initialized successfully.");
            } else {
                logger.warn("FirebaseApp is already initialized.");
            }
        } catch (Exception e) {
            logger.error("Error initializing Firebase: {}", e.getMessage(), e);
            throw new RuntimeException("Firebase initialization failed", e);
        }
    }
}
