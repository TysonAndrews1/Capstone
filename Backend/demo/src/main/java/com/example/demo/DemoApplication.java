//Reference: https://start.spring.io/
//I use this website to initialize a spring boot project. It allows you to generate a spring boot project with the correct project, language, and java version.
//For our project we are using Project: Maven, Language: Java, Java Version: 23.

package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.demo.config.FirebaseInitializer;

@EnableScheduling
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {

		// Run this file to start the backend server
		SpringApplication.run(DemoApplication.class, args);

		new FirebaseInitializer();

	}

}
