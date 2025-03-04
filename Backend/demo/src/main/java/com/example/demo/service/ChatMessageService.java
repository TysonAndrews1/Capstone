package com.example.demo.service;

import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public BanquetChatMessage saveMessage(BanquetChatMessage message) {
        return chatMessageRepository.save(message);
    }

    public List<BanquetChatMessage> getChatHistory() {
        return chatMessageRepository.findAll();
    }

    public List<BanquetChatMessage> getChatHistoryForUser(String sender, String recipient) {
        return chatMessageRepository.findBySenderAndRecipient(sender, recipient);
    }

}
