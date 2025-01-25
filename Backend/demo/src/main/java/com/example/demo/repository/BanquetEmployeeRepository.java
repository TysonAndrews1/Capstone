package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.BanquetEmployee;

public interface BanquetEmployeeRepository extends JpaRepository<BanquetEmployee, Long> {
    BanquetEmployee findByEmail(String email);

}
