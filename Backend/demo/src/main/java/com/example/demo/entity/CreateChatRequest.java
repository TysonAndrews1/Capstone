package com.example.demo.entity;

import java.util.List;

public class CreateChatRequest {
    private String name;
    private List<Long> accountIds; // List of account IDs to add to the chat

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getAccountIds() {
        return accountIds;
    }

    public void setAccountIds(List<Long> accountIds) {
        this.accountIds = accountIds;
    }
}
