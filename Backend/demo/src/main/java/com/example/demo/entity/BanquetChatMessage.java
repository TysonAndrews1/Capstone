package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class BanquetChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String content;
    private String recipient;
    private messageType type; // Can be "CHAT", "JOIN", etc.

    private LocalDateTime timestamp;

    public BanquetChatMessage() {
        this.timestamp = LocalDateTime.now();
    }
    // Getters and Setters
}
