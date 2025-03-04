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

    @PostMapping("/clockin")
    public ResponseEntity<Map<String, Object>> clockIn(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received Clock-In Request: " + requestBody);

        if (!requestBody.containsKey("account_id")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Missing account_id"));
        }

        try {
            Long accountId = Long.parseLong(requestBody.get("account_id").toString());
            Optional<EmployeeAttendance> existingAttendance = repository.findLatestClockInByAccountId(accountId);
            if (existingAttendance.isPresent()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Employee is already clocked in."));
            }

            EmployeeAttendance attendance = new EmployeeAttendance();
            attendance.setAccountId(accountId);
            attendance.setClockInTime(LocalDateTime.now());
            attendance.setStatus("CLOCKED_IN");

            repository.save(attendance);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Clock-in successful");
            response.put("clock_in_time", attendance.getClockInTime());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Server Error: " + e.getMessage()));
        }
    }

    @PutMapping("/clockout")
    public ResponseEntity<Map<String, Object>> clockOut(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received Clock-Out Request: " + requestBody);
        if (!requestBody.containsKey("account_id")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Missing account_id"));
        }

        try {
            Long accountId = Long.parseLong(requestBody.get("account_id").toString());

            Optional<EmployeeAttendance> latestAttendance = repository.findLatestClockInByAccountId(accountId);

            if (latestAttendance.isPresent()) {
                EmployeeAttendance attendance = latestAttendance.get();
                attendance.setClockOutTime(LocalDateTime.now());
                attendance.setStatus("CLOCKED_OUT");
                repository.save(attendance);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Clock-out successful");
                response.put("clock_out_time", attendance.getClockOutTime());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "No active clock-in found for this employee."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Server Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{attendanceId}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long attendanceId) {
        if (repository.existsById(attendanceId)) {
            repository.deleteById(attendanceId);
            return ResponseEntity.ok("Attendance record deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
