package com.example.demo.controller;

import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/chat")
public class BanquetChatController {

    private final ChatMessageService chatMessageService;

    public BanquetChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public BanquetChatMessage sendMessage(@Payload BanquetChatMessage chatMessage) {
        return chatMessageService.saveMessage(chatMessage); // Save message in DB
    }

    @GetMapping("/history")
    public List<BanquetChatMessage> getChatHistory() {
        return chatMessageService.getChatHistory(); // Fetch stored messages
    }

    @MessageMapping("/chat.addUser") // For adding users if required
    @SendTo("/topic/public")
    public BanquetChatMessage addUser(@Payload BanquetChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("name", chatMessage.getSender());
        return chatMessage;
    }
}
