package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetEvent;
import com.example.demo.repository.BanquetEventRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// Tells Spring to handle any HTTP requests and return a JSON format
@RestController

// Any HTTP request to this endpoint will be routed to this controller
@RequestMapping("/api/events")
public class BanquetEventController {

// Allows Spring to use BanquetEventRepository automatically into the controller
@Autowired
private BanquetEventRepository repository;

// Display a list of all events in the database
@GetMapping
public List<BanquetEvent> getAllEvents() {
    return repository.findAll();
}

// Filters events by timeframe (past or upcoming)
@GetMapping("/filter")
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

// Will use this method to create new events using infomation from the frontend
// *Work in progress still*
@PostMapping
public BanquetEvent createEvent(@RequestBody BanquetEvent event) {
    return repository.save(event);
}
}
