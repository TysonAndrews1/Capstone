package com.example.demo.service;

import com.example.demo.entity.BanquetChat;
import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.repository.ChatRepository;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository.*;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessage(Long chatId, Long senderId, String content) {
        BanquetChat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        BanquetChatMessage message = new BanquetChatMessage();
        message.setSenderId(senderId);
        message.setContent(content);
        message.setChat(chat);
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, message);
    }

    public List<BanquetChatMessage> getMessages(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        return chat.getMessages();
    }

    public void clearChat(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        messageRepository.deleteAll(chat.getMessages());
    }
}