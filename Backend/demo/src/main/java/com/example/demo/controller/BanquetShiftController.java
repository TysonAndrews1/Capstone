package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.entity.BanquetShift;
import com.example.demo.repository.BanquetShiftRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("api/shifts")
public class BanquetShiftController {

    @Autowired
    private BanquetShiftRepository repository;

    @GetMapping
    public List<BanquetShift> getAllShifts() {
        return repository.findAll();
    }

    // @GetMapping("/{shiftId}") // Get a specific shift by ID
    // public ResponseEntity<BanquetShift> getShiftById(@PathVariable Long shiftId) {
    //     // Retrieve the shift by ID using the repository
    //     Optional<BanquetShift> shift = repository.findById(shiftId);

    //     if (shift.isPresent()) {
    //         return ResponseEntity.ok(shift.get()); // Return the event if found
    //     } else {
    //         return ResponseEntity.status(404).body(null); // Return 404 if event not found
    //     }
    // }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<BanquetShift>> getShiftByAccountId(@PathVariable Long accountId) {
        List<BanquetShift> shifts = repository.findAllByAccountId(accountId);
        
        if (shifts.isEmpty()) {
            return ResponseEntity.ok(shifts); // 빈 리스트 반환
        } else {
            return ResponseEntity.ok(shifts); // 데이터가 있으면 리스트 반환
        }
    }

    @PostMapping // Saving shift
    public ResponseEntity<String> addShift(@RequestBody BanquetShift shift) {
        try {
            repository.save(shift); 
            return ResponseEntity.ok("Shift added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding shift: " + e.getMessage());
        }
    }

    @DeleteMapping({"/{shiftId}"}) // Delete shift by shiftId.
    public ResponseEntity<String> deleteShift(@PathVariable Long shiftId){
        if (repository.existsById(shiftId)) { // Check if shift exists
            repository.deleteById(shiftId); // Delete specific event
            return ResponseEntity.ok("Shift was deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Shift not found.");
        }
    }

}
