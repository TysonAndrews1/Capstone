package com.example.demo.controller;

import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.ChatDTO;
import com.example.demo.entity.BanquetChat;
import com.example.demo.entity.CreateChatRequest;
import com.example.demo.service.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat/{chatId}/send")
    public void sendMessage(@DestinationVariable Long chatId, @Payload BanquetChatMessage message) {

        message.setChat(chatService.getChatById(chatId)); // Set the chat from the chatId
        chatService.sendMessage(message, chatId); // Call service to save message
    }

    @MessageMapping("/echo")
    public String echo(@Payload String message) {
        System.out.println("Echo received: " + message);
        return message;
    }

    @GetMapping("/messages/{chatId}")
    public List<BanquetChatMessage> getMessages(@PathVariable Long chatId) {
        return chatService.getMessages(chatId);
    }

    @GetMapping("/get")
    public List<BanquetChat> getMessages() {
        return chatService.getAll();
    }

    @DeleteMapping("/clear/{chatId}")
    public void clearChat(@PathVariable Long chatId) {
        chatService.clearChat(chatId);

    }

    @PostMapping("/create")
    public ResponseEntity<BanquetChat> createChat(@RequestBody CreateChatRequest request) {
        BanquetChat newChat = chatService.createChat(request.getName(), request.getAccountIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(newChat);
    }

    @GetMapping("/{chatId}/with-participants")
    public ChatDTO getChatWithParticipants(@PathVariable Long chatId) {
        return chatService.getChatWithParticipants(chatId);
    }

    @GetMapping("/{chatId}/participants")
    public List<AccountDTO> getChatParticipants(@PathVariable Long chatId) {
        return chatService.getChatParticipants(chatId);
    }

}
