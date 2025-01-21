package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.BanquetAccount;

public interface BanquetAccountRepository extends JpaRepository<BanquetAccount, Long> {
    // Currently using built-in CRUD operations from Spring Data JPA.
}
