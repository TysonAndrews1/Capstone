package com.example.demo.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.example.demo.entity.BanquetChatMessage;

@Controller
public class BanquetChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public BanquetChatMessage sendMessage(
            @Payload BanquetChatMessage chatMessage) {
        return chatMessage;
    }

    public BanquetChatMessage addUser(
            @Payload BanquetChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("name", chatMessage.getSender());
        return chatMessage;
    }
}
