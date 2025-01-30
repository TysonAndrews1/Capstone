package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetAccount;
import com.example.demo.repository.BanquetAccountRepository;
import com.example.demo.service.FirebaseAccountService;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController // Tells Spring to handle any HTTP requests and return a JSON format
@RequestMapping("/api/accounts") // Any HTTP request to this endpoint will be routed to this controller
public class BanquetAccountController {

    @Autowired
    private FirebaseAccountService firebaseAccountService;
    
    @Autowired // Allows Spring to use BanquetAccountRepository automatically into the controller
    private BanquetAccountRepository repository;

    @GetMapping // Display a list of all accounts in the database
    public List<BanquetAccount> getAllAccounts(){
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

    // API to manually create a Firebase user by email and password
    // This is for test, so we need to delete this later.
    @GetMapping("/create-user")
    public String createUser(@RequestParam String email, @RequestParam String password) {
        try {
            firebaseAccountService.createFirebaseAccount(email, password);
            return "User creation request processed successfully.";
        } catch (Exception e) {
            return "Error creating user: " + e.getMessage();
        }
    }

    // API to add a new employee and create a Firebase account
    @PostMapping("/add-employee")
    public String addEmployee(@RequestBody BanquetAccount employee) {
        repository.save(employee);

        // Clean up phone number by removing hyphens
        String cleanPhoneNumber = employee.getPhoneNumber().replaceAll("-", "");
        String password = employee.getLastName() + cleanPhoneNumber;

        try {
            firebaseAccountService.createFirebaseAccount(employee.getEmail(), password);
            return "Employee added and Firebase account created.";
            
        } catch (Exception e) {
            return "Employee added to database, but Firebase account already exists: " + e.getMessage();
        }
    }

    // API to sync all employees in MySQL to Firebase
    @GetMapping("/sync-users")
    public String syncUsers() {
        try {
            // Call the service method to sync Firebase accounts
            firebaseAccountService.syncFirebaseAccounts();
            return "Firebase accounts synchronized successfully.";
        } catch (Exception e) {
            return "Error synchronizing accounts: " + e.getMessage();
        }
    }

    // API to retrieve a specific employee by email
    @GetMapping("/user")
    public ResponseEntity<BanquetAccount> getUserByEmail(@RequestParam String email) {
        BanquetAccount employee = repository.findByEmail(email);
        if (employee != null) {
            return ResponseEntity.ok(employee); // Return 200 with employee data
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } // Return 404 if no employee found
        }
    @PostMapping // Will use this method to create new events using infomation from the frontend
    public BanquetAccount createAccount(@RequestBody BanquetAccount account) {
        return repository.save(account);
    }
}