package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.BanquetShift;
import java.util.List;

public interface BanquetShiftRepository extends JpaRepository<BanquetShift, Long> {
    // Currently using built-in CRUD operations from Spring Data JPA.
    List<BanquetShift> findAllByAccountId(Long accountId);
}
