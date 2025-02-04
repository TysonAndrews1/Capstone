//Reference: https://masteringbackend.com/posts/spring-boot
//I use this guide to help me setup the SpringBoot backend server. It provided examples on how to setup and use the basic CRUD operations built into Spring/JPA.

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
@RestController //Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/events") //Any HTTP request to this endpoint will be routed to this controller
public class BanquetEventController {

    @Autowired //Allows Spring to use BanquetEventRepository automatically into the controller
    private BanquetEventRepository repository;

    @GetMapping // Display a list of all events in the database
    public List<BanquetEvent> getAllEvents() {
        return repository.findAll();
    }

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

    @GetMapping("/filter") // Filters events by time frame (past or upcoming)
    public List<BanquetEvent> getBanquetEventsByTimeframe(@RequestParam String timeframe) {

        LocalDateTime today = LocalDate.now().atStartOfDay(); // Store the local time and date
        List<BanquetEvent> allEvents = repository.findAll(); // Takes all events from database and store in a list

        // Compares event with today date and time
        return allEvents.stream().filter(event -> {
            if ("past".equalsIgnoreCase(timeframe)) {
                return event.getEventEndDate().isBefore(today); // Check if the event has ended before today
            } else if ("upcoming".equalsIgnoreCase(timeframe)) { // Check if the event starts before or on today and ends after today
                return event.getEventEndDate().isAfter(today);
            }
            return false;
        })
                .collect(Collectors.toList());
    }

    @PostMapping // Create new events using information from the frontend
    public BanquetEvent createEvent(@RequestBody BanquetEvent event) {
        return repository.save(event);
    }

    @DeleteMapping("/{eventId}") // Delete event by eventId.
    public ResponseEntity<String> deleteEvent(@PathVariable Long eventId) {

        if (repository.existsById(eventId)) {  // Check if the event exists in the database
            repository.deleteById(eventId); // Delete specific event
            return ResponseEntity.ok("Event was deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Event not found.");
        }
    }

    @PutMapping("/{eventId}") // Update event by eventId
    public ResponseEntity<BanquetEvent> updateEvent(@PathVariable Long eventId,
            @RequestBody BanquetEvent updatedEvent) {

        // Locates event by eventId and update any new information given by the frontend.
        return repository.findById(eventId)
                .map(event -> {
                    event.setEventName(updatedEvent.getEventName());
                    event.setEventStartDate(updatedEvent.getEventStartDate());
                    event.setEventEndDate(updatedEvent.getEventEndDate());
                    event.setEventLocation(updatedEvent.getEventLocation());
                    event.setNumberOfGuests(updatedEvent.getNumberOfGuests());
                    event.setAssignedManager(updatedEvent.getAssignedManager());
                    event.setSpecialRequirements(updatedEvent.getSpecialRequirements());
                    return ResponseEntity.ok(repository.save(event));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}