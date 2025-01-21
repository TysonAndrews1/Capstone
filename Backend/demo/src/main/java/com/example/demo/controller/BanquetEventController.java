package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetEvent;
import com.example.demo.repository.BanquetEventRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController // Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/events") // Any HTTP request to this endpoint will be routed to this controller
public class BanquetEventController {

    @Autowired // Allows Spring to use BanquetEventRepository automatically into the controller
    private BanquetEventRepository repository;

    @GetMapping // Display a list of all events in the database
    public List<BanquetEvent> getAllEvents() {
        return repository.findAll();
    }

    // New method to get an event by ID
    @GetMapping("/{eventId}") // Get a specific event by ID
    public ResponseEntity<BanquetEvent> getEventById(@PathVariable Long eventId) {
        // Retrieve the event by ID using the repository
        Optional<BanquetEvent> event = repository.findById(eventId);
        
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get()); // Return the event if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if event not found
        }
    }

    @GetMapping("/filter") // Filters events by timeframe (past or upcoming)
    public List<BanquetEvent> getBanquetEventsByTimeframe(@RequestParam String timeframe) {

        // Store the loacal time and date
        LocalDateTime today = LocalDate.now().atStartOfDay();

        // Takes all events from database and stoer in a list
        List<BanquetEvent> allEvents = repository.findAll();

        // Compares event with today date and time
        return allEvents.stream().filter(event -> {
            if ("past".equalsIgnoreCase(timeframe)) {
                // Check if the event has ended before today
                return event.getEventEndDate().isBefore(today);
            } else if ("upcoming".equalsIgnoreCase(timeframe)) {
                // Check if the event starts before or on today and ends after today
                return event.getEventEndDate().isAfter(today);
            }
            return false;
        })
                .collect(Collectors.toList());
    }

    @PostMapping // Will use this method to create new events using infomation from the frontend
    public BanquetEvent createEvent(@RequestBody BanquetEvent event) {
        return repository.save(event);
    }

    @DeleteMapping("/{eventId}") // Create a delete method by event ID
    public ResponseEntity<String> deleteEvent(@PathVariable Long eventId) {

        System.out.println("Delete request received for ID: " + eventId);
        // Check if the event exists in the database
        if (repository.existsById(eventId)) {
            // Delete specific event
            repository.deleteById(eventId);
            return ResponseEntity.ok("Event was deleted successfully.");
        } else {
            // Return an error message of event does not exist
            return ResponseEntity.status(404).body("Event not found.");
        }
    }
}