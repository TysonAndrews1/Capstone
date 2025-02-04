//Reference: https://masteringbackend.com/posts/spring-boot
//I use this guide to help me setup the SpringBoot backend server. It provided examples on how to setup and use the basic CRUD operations built into Spring/JPA.

package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.BanquetAvailability;
import com.example.demo.repository.BanquetAvailabilityRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController //Tells Spring to handle any HTTP availability and return a JSON format
@RequestMapping("/api/availability") //Any HTTP availability to this endpoint will be routed to this controller
public class BanquetAvailabilityController {

    @Autowired //Allows Spring to use BanquetAvailabilityRepository automatically into the controller
    private BanquetAvailabilityRepository repository;

    @GetMapping //Display all availability for each employee
    public List<BanquetAvailability> getAllAvailability(){
        return repository.findAll();
    }

    @GetMapping("/{availabilityId}") // Get a specific availability by ID
    public ResponseEntity<BanquetAvailability> getAvailabilityById(@PathVariable Long availabilityId) {
        // Retrieve the availability by ID using the repository
        Optional<BanquetAvailability> availability = repository.findById(availabilityId);

        if (availability.isPresent()) {
            return ResponseEntity.ok(availability.get()); // Return the availability if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if availability not found
        }
    }

    @PostMapping //Create new availability using information from the frontend
    public BanquetAvailability createAvailability(@RequestBody BanquetAvailability availability) {
        return repository.save(availability);
    }

    @DeleteMapping("/{availabilityId}") //Delete availability by availabilityId
    public ResponseEntity<String> deleteAvailability(@PathVariable Long availabilityId) {

        if (repository.existsById(availabilityId)) {  // Check if the availability exists in the database
            repository.deleteById(availabilityId); // Delete specific availability
            return ResponseEntity.ok("Employee's availability was deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Employee's availability not found.");
        }
    }

    @PutMapping("/{availabilityId}") //Update availability by availabilityId
    public ResponseEntity<BanquetAvailability> updateAvailability(@PathVariable Long availabilityId, @RequestBody BanquetAvailability updateAvailability) {
        return repository.findById(availabilityId)
        .map(availability -> {
            availability.setDay(updateAvailability.getDay());
            availability.setStartTime(updateAvailability.getStartTime());
            availability.setEndTime(updateAvailability.getEndTime());
            return ResponseEntity.ok(repository.save(availability));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
