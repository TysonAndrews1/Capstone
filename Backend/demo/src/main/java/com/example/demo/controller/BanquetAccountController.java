package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetAccount;
import com.example.demo.repository.BanquetAccountRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController // Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/accounts") // Any HTTP request to this endpoint will be routed to this controller
public class BanquetAccountController {

    @Autowired // Allows Spring to use BanquetAccountRepository automatically into the
               // controller
    private BanquetAccountRepository repository;

    @GetMapping // Display a list of all accounts in the database
    public List<BanquetAccount> getAllAccounts() {
        return repository.findAll();
    }

    @GetMapping("/{accountId}") // Get a specific event by ID
    public ResponseEntity<BanquetAccount> getAccountById(@PathVariable Long accountId) {
        // Retrieve the account by ID using the repository
        Optional<BanquetAccount> account = repository.findById(accountId);

        if (account.isPresent()) {
            return ResponseEntity.ok(account.get()); // Return the event if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if event not found
        }
    }
}
