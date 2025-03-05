package com.example.demo.controller;

import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public void sendMessage(@RequestParam Long chatId, @RequestParam Long senderId, @RequestParam String content) {
        chatService.sendMessage(chatId, senderId, content);
    }

    @GetMapping("/messages/{chatId}")
    public List<BanquetChatMessage> getMessages(@PathVariable Long chatId) {
        return chatService.getMessages(chatId);
    }

    @DeleteMapping("/clear/{chatId}")
    public void clearChat(@PathVariable Long chatId) {
        chatService.clearChat(chatId);
    }
}
