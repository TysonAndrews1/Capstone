package com.example.demo.repository;

import com.example.demo.entity.BanquetChatMessage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<BanquetChatMessage, Long> {
    List<BanquetChatMessage> findBySenderAndRecipient(String sender, String recipient);
}
