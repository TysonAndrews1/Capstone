//Reference: https://masteringbackend.com/posts/spring-boot
//Reference: Code from BanquetAccountRepository.java

package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.EmployeeAttendance;
import java.util.List;

public interface EmployeeAttendanceRepository extends JpaRepository<EmployeeAttendance, Long> {

    // Retrieve attendance records by employee ID
    List<EmployeeAttendance> findByEmployeeId(String employeeId);
    
    // Retrieve attendance records by date
    List<EmployeeAttendance> findByDate(String date);
}
