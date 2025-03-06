package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.BanquetWinner;
import com.example.demo.repository.BanquetWinnerRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController // Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/winner") //Any HTTP request to this endpoint will be routed to this controller
public class BanquetWinnerController {

    @Autowired // Allows Spring to use BanquetAccountRepository automatically into the controller
    private BanquetWinnerRepository repository;

    @GetMapping // Display a list of all accounts in the database
    public List<BanquetWinner> getWinner() {
        return repository.findAll();
    }

    @PostMapping // Create new accounts using information from the frontend
    public BanquetWinner saveWinner(@RequestBody BanquetWinner winner) {
        return repository.save(winner);
    }
}