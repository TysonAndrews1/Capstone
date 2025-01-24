package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.example.demo.config.FirebaseInitializer;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		
		// Run this file to start the backend server
		SpringApplication.run(DemoApplication.class, args);
		
		new FirebaseInitializer(); 

	}

}
