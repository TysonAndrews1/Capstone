package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetAccount;
import com.example.demo.entity.BanquetEvent;
import com.example.demo.repository.BanquetAccountRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController // Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/accounts") // Any HTTP request to this endpoint will be routed to this controller
public class BanquetAccountController {

    @Autowired
    private BanquetAccountRepository repository;

    @GetMapping
    public List<BanquetAccount> getAllAccounts(){
        return repository.findAll();
    }

    
}
