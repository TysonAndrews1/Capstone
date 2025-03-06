package com.example.demo.repository;

import com.example.demo.entity.BanquetChatMessage;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<BanquetChatMessage, Long> {
    @Transactional
    @Modifying
    @Query("DELETE FROM BanquetChatMessage m WHERE m.chat.id = :chatId")
    void deleteByChatId(@Param("chatId") Long chatId);
}
