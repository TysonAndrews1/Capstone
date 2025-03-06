package com.example.demo.repository;

import com.example.demo.entity.BanquetChat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<BanquetChat, Long> {
    // @Query("DELETE FROM BanquetChat c WHERE c.id NOT IN (SELECT DISTINCT ca.id
    // FROM ChatAccount ca) AND c.id != 1")
    // void deleteChatsWithoutParticipantsExcludingChat1();
}