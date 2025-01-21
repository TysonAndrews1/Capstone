package com.example.demo.service;

import com.example.demo.entity.BanquetEmployee;
import com.example.demo.repository.BanquetEmployeeRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FirebaseAccountService {

    @Autowired
    private BanquetEmployeeRepository employeeRepository;

    // Synchronize all employees in MySQL to Firebase
    public void syncFirebaseAccounts() {
        List<BanquetEmployee> employees = employeeRepository.findAll();
    
        for (BanquetEmployee employee : employees) {
            // Clean up phone number by removing hyphens
            String cleanPhoneNumber = employee.getPhoneNumber().replaceAll("-", "");
            String password = cleanPhoneNumber;
    
            try {
                FirebaseAuth.getInstance().getUserByEmail(employee.getEmail());
                System.out.println("User already exists: " + employee.getEmail());
            } catch (Exception e) {
                createFirebaseAccount(employee.getEmail(), password);
            }
        }
    }
    

    // Create a Firebase account for a given email and password
    public void createFirebaseAccount(String email, String password) {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password);

        try {
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            System.out.println("Successfully created user: " + userRecord.getUid());
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
        }
    }
}
