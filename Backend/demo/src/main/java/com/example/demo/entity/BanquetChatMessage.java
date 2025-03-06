package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@Table(name = "banquet_chat_messages") // Maps the class to the banquet_events table in the database
public class BanquetChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private String content;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false) // Ensures messages are linked to a chat
    private BanquetChat chat;

    public BanquetChatMessage() {

    }

    public BanquetChatMessage(Long senderId, String content) {
        this.content = content;
        this.senderId = senderId;
    }
    // Getters and Setters
}
