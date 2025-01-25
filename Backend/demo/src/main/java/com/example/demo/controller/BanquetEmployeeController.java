package com.example.demo.controller;

import com.example.demo.entity.BanquetEmployee;
import com.example.demo.repository.BanquetEmployeeRepository;
import com.example.demo.service.FirebaseAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BanquetEmployeeController {

    @Autowired
    private FirebaseAccountService firebaseAccountService;

    @Autowired
    private BanquetEmployeeRepository employeeRepository;

    // API to manually create a Firebase user by email and password
    // This is for test, so we need to delete this later.
    @GetMapping("/api/create-user")
    public String createUser(@RequestParam String email, @RequestParam String password) {
        try {
            firebaseAccountService.createFirebaseAccount(email, password);
            return "User creation request processed successfully.";
        } catch (Exception e) {
            return "Error creating user: " + e.getMessage();
        }
    }

    // API to add a new employee and create a Firebase account
    @PostMapping("/api/add-employee")
    public String addEmployee(@RequestBody BanquetEmployee employee) {
        employeeRepository.save(employee);

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
    @GetMapping("/api/sync-users")
    public String syncUsers() {
        try {
            // Call the service method to sync Firebase accounts
            firebaseAccountService.syncFirebaseAccounts();
            return "Firebase accounts synchronized successfully.";
        } catch (Exception e) {
            return "Error synchronizing accounts: " + e.getMessage();
        }
    }

    // API to retrieve all employees from the database
    @GetMapping("/api/employees")
    public List<BanquetEmployee> getAllEmployees() {
        return employeeRepository.findAll(); // Retrieve all employees
    }

    // API to retrieve a specific employee by email
    @GetMapping("/api/user")
    public ResponseEntity<BanquetEmployee> getUserByEmail(@RequestParam String email) {
        BanquetEmployee employee = employeeRepository.findByEmail(email);
        if (employee != null) {
            return ResponseEntity.ok(employee); // Return 200 with employee data
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if no employee found
        }
    }
}
