package com.example.demo.service;

import com.example.demo.entity.BanquetChat;
import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.repository.ChatRepository;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDateTime;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessage(BanquetChatMessage message, long chatId) {
        message.setTimestamp(LocalDateTime.now()); // Set the timestamp
        messageRepository.save(message); // Save the message to the DB
        try {
            messagingTemplate.convertAndSend("/topic/chat/" + chatId, message);
            System.out.println("Message broadcast complete");
        } catch (Exception e) {
            System.err.println("Error broadcasting message: " + e.getMessage());
            e.printStackTrace();
        }

    }

    public List<BanquetChatMessage> getMessages(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        return chat.getMessages();
    }

    public void clearChat(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        messageRepository.deleteAll(chat.getMessages());
        messageRepository.deleteByChatId(chatId);
    }

    public BanquetChat getChatById(Long chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
    }
}