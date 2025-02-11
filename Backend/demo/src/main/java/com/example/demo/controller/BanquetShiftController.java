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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.entity.BanquetShift;
import com.example.demo.repository.BanquetShiftRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController //Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("api/shifts") //Any HTTP request to this endpoint will be routed to this controller
public class BanquetShiftController {

    @Autowired // Allows Spring to use BanquetShiftRepository automatically into the controller
    private BanquetShiftRepository repository;

    @GetMapping
    public List<BanquetShift> getAllShifts() {
        return repository.findAll();
    }

    @GetMapping("/{shiftId}") // Get a specific shift by ID
    public ResponseEntity<BanquetShift> getShiftById(@PathVariable Long shiftId) {
        // Retrieve the shift by ID using the repository
        Optional<BanquetShift> shift = repository.findById(shiftId);

        if (shift.isPresent()) {
            return ResponseEntity.ok(shift.get()); // Return the event if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if event not found
        }
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<BanquetShift>> getShiftByAccountId(@PathVariable Long accountId) {
        List<BanquetShift> shifts = repository.findAllByAccountId(accountId);
        
        if (shifts.isEmpty()) {
            return ResponseEntity.ok(shifts); // Return an empty array
        } else {
            return ResponseEntity.ok(shifts); // Return a list if there is data
        }
    }

    @PostMapping //Create shift from information provided from the frontend
    public ResponseEntity<String> addShift(@RequestBody BanquetShift shift) {
        try {
            repository.save(shift); 
            return ResponseEntity.ok("Shift added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding shift: " + e.getMessage());
        }
    }

    @DeleteMapping("/{shiftId}") //Delete shift by shiftId.
    public ResponseEntity<String> deleteShift(@PathVariable Long shiftId){
        if (repository.existsById(shiftId)) { // Check if shift exists
            repository.deleteById(shiftId); // Delete specific event
            return ResponseEntity.ok("Shift was deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Shift not found.");
        }
    }

    @PutMapping("/{shiftId}") //Update shift by shiftId
    public ResponseEntity<BanquetShift> updateShift(@PathVariable Long shiftId, @RequestBody BanquetShift updatedShift) {
        return repository.findById(shiftId)
        .map(shift -> {
            shift.setAccountId(updatedShift.getAccountId());
            shift.setEventId(updatedShift.getEventId());
            shift.setShiftStartDate(updatedShift.getShiftStartDate());
            shift.setShiftEndDate(updatedShift.getShiftEndDate());
            shift.setDescription(updatedShift.getDescription());
            shift.setSwappable(updatedShift.getSwappable());
            return ResponseEntity.ok(repository.save(shift));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
