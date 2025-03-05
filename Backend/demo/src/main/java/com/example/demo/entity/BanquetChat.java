package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import java.util.List;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
public class BanquetChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BanquetChatMessage> messages;

    @ElementCollection
    private List<Long> accountIds; // List of allowed account IDs
}