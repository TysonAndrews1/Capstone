package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
public class BanquetChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private String content;
    private LocalDateTime timestamp;

    public BanquetChatMessage() {

    }

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private BanquetChat chat;
    // Getters and Setters
}
