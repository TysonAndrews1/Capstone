//Reference: https://masteringbackend.com/posts/spring-boot
//I use this guide to help me setup the SpringBoot backend server. It provided examples on how to setup the repository and extend the JPA.

package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.BanquetWinner;

public interface BanquetWinnerRepository extends JpaRepository<BanquetWinner, Long> {
    // Currently using built-in CRUD operations from Spring Data JPA.

}