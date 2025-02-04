//Reference: https://masteringbackend.com/posts/spring-boot
//I use this guide to help me setup the SpringBoot backend server. It provided examples on how to setup and use the basic CRUD operations built into Spring/JPA.

package com.example.demo.controller;

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

import com.example.demo.entity.BanquetRequest;
import com.example.demo.repository.BanquetRequestRepository;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController //Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/requests") //Any HTTP request to this endpoint will be routed to this controller
public class BanquetRequestController {

    @Autowired //Allows Spring to use BanquetRequestRepository automatically into the controller
    private BanquetRequestRepository repository;

    @GetMapping //Display a list of all employee request from the database
    public List<BanquetRequest> getAllRequests(){
        return repository.findAll();
    }

    @GetMapping("/{requestId}") // Get a specific request by ID
    public ResponseEntity<BanquetRequest> getRequestById(@PathVariable Long requestId) {
        // Retrieve the request by ID using the repository
        Optional<BanquetRequest> request = repository.findById(requestId);

        if (request.isPresent()) {
            return ResponseEntity.ok(request.get()); // Return the request if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if request not found
        }
    }

    @PostMapping //Create new request using information from the frontend
    public BanquetRequest createRequest(@RequestBody BanquetRequest request) {
        return repository.save(request);
    }

    @DeleteMapping("/{requestId}") //Delete request by requestId
    public ResponseEntity<String> deleteRequest(@PathVariable Long requestId) {

        if (repository.existsById(requestId)) {  // Check if the request exists in the database
            repository.deleteById(requestId); // Delete specific request
            return ResponseEntity.ok("Request was deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Request not found.");
        }
    }

    @PutMapping("/{requestId}") //Update request by requestId
    public ResponseEntity<BanquetRequest> updateRequest(@PathVariable Long requestId, @RequestBody BanquetRequest updateRequest) {
        return repository.findById(requestId)
        .map(request -> {
            request.setRequestType(updateRequest.getRequestType());
            request.setRequestDate(updateRequest.getRequestDate());
            request.setStartDate(updateRequest.getStartDate());
            request.setEndDate(updateRequest.getEndDate());
            request.setDetails(updateRequest.getDetails());
            request.setStatus(updateRequest.getStatus());
            return ResponseEntity.ok(repository.save(request));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
