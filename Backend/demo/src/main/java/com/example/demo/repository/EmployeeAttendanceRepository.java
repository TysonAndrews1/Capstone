package com.example.demo.repository;

import com.example.demo.entity.EmployeeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface EmployeeAttendanceRepository extends JpaRepository<EmployeeAttendance, Long> {
    
    @Query("SELECT a FROM EmployeeAttendance a WHERE a.accountId = ?1 ORDER BY a.clockInTime DESC")
    List<EmployeeAttendance> findByAccountId(Long accountId);

    @Query("SELECT a FROM EmployeeAttendance a WHERE a.accountId = ?1 AND a.clockOutTime IS NULL")
    List<EmployeeAttendance> findOpenShiftByAccountId(Long accountId);

    @Query("SELECT a FROM EmployeeAttendance a WHERE a.accountId = ?1 AND a.clockOutTime IS NULL ORDER BY a.clockInTime DESC LIMIT 1")
    Optional<EmployeeAttendance> findLatestClockInByAccountId(Long accountId);

}
