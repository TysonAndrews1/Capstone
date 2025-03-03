//Reference: https://masteringbackend.com/posts/spring-boot
//Reference: Copied and modified the code from BanquetAccountController.java to create EmployeeAttendanceController.java

package com.example.demo.controller;

import com.example.demo.entity.EmployeeAttendance;
import com.example.demo.repository.EmployeeAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeAttendance> getAttendanceByEmployee(@PathVariable String employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    @GetMapping("/date/{date}")
    public List<EmployeeAttendance> getAttendanceByDate(@PathVariable String date) {
        return repository.findByDate(date);
    }

    @PostMapping
    public EmployeeAttendance createAttendance(@RequestBody EmployeeAttendance attendance) {
        return repository.save(attendance);
    }

    @PutMapping("/{attendanceId}")
    public ResponseEntity<EmployeeAttendance> updateAttendance(@PathVariable Long attendanceId, @RequestBody EmployeeAttendance updatedAttendance) {
        return repository.findById(attendanceId)
                .map(attendance -> {
                    attendance.setEmployeeId(updatedAttendance.getEmployeeId());
                    attendance.setDate(updatedAttendance.getDate());
                    attendance.setClockInTime(updatedAttendance.getClockInTime());
                    attendance.setClockOutTime(updatedAttendance.getClockOutTime());
                    attendance.setStatus(updatedAttendance.getStatus());
                    return ResponseEntity.ok(repository.save(attendance));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
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
