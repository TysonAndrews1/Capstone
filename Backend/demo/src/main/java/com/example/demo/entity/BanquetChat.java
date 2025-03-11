package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@Table(name = "banquet_chat") // Maps the class to the banquet_events table in the database
public class BanquetChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<BanquetChatMessage> messages;

    @ManyToMany
    @JoinTable(name = "banquet_chat_accounts", joinColumns = @JoinColumn(name = "chat_id"), inverseJoinColumns = @JoinColumn(name = "account_id"))
    @JsonIgnore
    private List<BanquetAccount> accounts;

    // Explicit no-argument constructor
    public BanquetChat() {
    }
}
