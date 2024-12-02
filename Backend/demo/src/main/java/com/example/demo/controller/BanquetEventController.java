package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetEvent;
import com.example.demo.repository.BanquetEventRepository;

import java.util.List;

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

    // Will use this method to create new events using infomation from the frontend
    // *Work in progress still*
    @PostMapping
    public BanquetEvent createEvent(@RequestBody BanquetEvent event) {
        return repository.save(event);
    }
}
