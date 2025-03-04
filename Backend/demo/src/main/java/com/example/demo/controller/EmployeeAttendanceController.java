//Reference: https://masteringbackend.com/posts/spring-boot
//Reference: Modified the code from BanquetAccountController.java to create EmployeeAttendanceController.java
//Reference: Can you adjust my EmployeeAttendanceController.java to ensure that multiple clock-ins without a clock-out is not allowed?

package com.example.demo.controller;

import com.example.demo.entity.EmployeeAttendance;
import com.example.demo.repository.EmployeeAttendanceRepository;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/attendance")
public class EmployeeAttendanceController {

    @Autowired
    private EmployeeAttendanceRepository repository;

    @GetMapping
    public List<EmployeeAttendance> getAllAttendance() {
        return repository.findAll();
    }

    @GetMapping("/{attendanceId}")
    public ResponseEntity<EmployeeAttendance> getAttendanceById(@PathVariable Long attendanceId) {
        Optional<EmployeeAttendance> attendance = repository.findById(attendanceId);
        return attendance.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{accountId}")
    public List<EmployeeAttendance> getAttendanceByEmployee(@PathVariable Long accountId) {
        return repository.findByAccountId(accountId);
    }

    @PostMapping("/clockin") // This is for the clock in
    public ResponseEntity<Map<String, Object>> clockIn(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received Clock-In Request: " + requestBody);

        if (!requestBody.containsKey("account_id")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Missing account_id"));
        }

        try {
            Long accountId = Long.parseLong(requestBody.get("account_id").toString()); // This will get the account_id from the request body
            Optional<EmployeeAttendance> existingAttendance = repository.findLatestClockInByAccountId(accountId);
            if (existingAttendance.isPresent()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Employee is already clocked in.")); // If the employee is already clocked in, it will return an error message
            }

            EmployeeAttendance attendance = new EmployeeAttendance(); // This will create a new attendance record for the employee in the database
            attendance.setAccountId(accountId);
            attendance.setClockInTime(LocalDateTime.now());
            attendance.setStatus("CLOCKED_IN");

            repository.save(attendance);

            Map<String, Object> response = new HashMap<>(); // This will return the clock-in time and a message
            response.put("message", "Clock-in successful");
            response.put("clock_in_time", attendance.getClockInTime());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Server Error: " + e.getMessage()));
        }
    }

    @PutMapping("/clockout") // This is for the clock out
    public ResponseEntity<Map<String, Object>> clockOut(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received Clock-Out Request: " + requestBody);
        if (!requestBody.containsKey("account_id")) { // If the account_id is not present, it will return an error message
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Missing account_id"));
        }

        try { // This will try to clock out the employee
            Long accountId = Long.parseLong(requestBody.get("account_id").toString());

            Optional<EmployeeAttendance> latestAttendance = repository.findLatestClockInByAccountId(accountId); // This will get the latest attendance record for the employee

            if (latestAttendance.isPresent()) {
                EmployeeAttendance attendance = latestAttendance.get();
                attendance.setClockOutTime(LocalDateTime.now());
                attendance.setStatus("CLOCKED_OUT");
                repository.save(attendance);

                Map<String, Object> response = new HashMap<>(); // This will return the clock-out time and a message
                response.put("message", "Clock-out successful");
                response.put("clock_out_time", attendance.getClockOutTime());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "No active clock-in found for this employee.")); // If there is no active clock-in, it will return an error message
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Server Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{attendanceId}") // This is for the delete attendance
    public ResponseEntity<String> deleteAttendance(@PathVariable Long attendanceId) {
        if (repository.existsById(attendanceId)) {
            repository.deleteById(attendanceId);
            return ResponseEntity.ok("Attendance record deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status") // This is for the attendance status
    public ResponseEntity<Map<String, Object>> getClockInStatus(@RequestParam Long account_id) {
        Optional<EmployeeAttendance> latestAttendance = repository.findLatestClockInByAccountId(account_id); // This will get the latest attendance record for the employee -- to ensure that it displays and keeps the current status

        if (latestAttendance.isPresent()) { // If the attendance record is present, it will return the status, clock in time, and clock out time
            EmployeeAttendance attendance = latestAttendance.get();
            Map<String, Object> response = new HashMap<>();
            response.put("status", attendance.getStatus());
            response.put("clock_in_time", attendance.getClockInTime());
            response.put("clock_out_time", attendance.getClockOutTime());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.ok(Collections.singletonMap("status", "CLOCKED_OUT"));
        }
    }

    @GetMapping("/logs") // This is for the Attendance Logs
    public ResponseEntity<List<Map<String, Object>>> getAttendanceLogs(@RequestParam(name = "account_id") Long accountId) {
        List<EmployeeAttendance> attendanceRecords = repository.findByAccountId(accountId);
        
        if (attendanceRecords.isEmpty()) { // In the case there are no records, it will return an empty list
            return ResponseEntity.ok(Collections.emptyList()); // Collections is a utility class that contains static methods that operate on collections.
        }

        List<Map<String, Object>> formattedLogs = attendanceRecords.stream().map(attendance -> {
            Map<String, Object> log = new HashMap<>();
            log.put("clock_in_time", attendance.getClockInTime() != null ? attendance.getClockInTime().toString() : null); // Clock In Time
            log.put("clock_out_time", attendance.getClockOutTime() != null ? attendance.getClockOutTime().toString() : null); // Clock Out Time
            return log;
        }).collect(Collectors.toList()); // Collects the logs into a list

        return ResponseEntity.ok(formattedLogs); // Returns the logs
    }
}
