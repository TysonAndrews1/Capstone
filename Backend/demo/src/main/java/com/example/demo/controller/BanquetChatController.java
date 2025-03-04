package com.example.demo.controller;

import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.service.ChatMessageService;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/chat")
public class BanquetChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    public BanquetChatController(ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public BanquetChatMessage sendMessage(@Payload BanquetChatMessage chatMessage) {
        return chatMessageService.saveMessage(chatMessage); // Save message in DB
    }

    @GetMapping("/privateMessages/{username}/{recipient}")
    public List<BanquetChatMessage> getPrivateMessages(@PathVariable String username, @PathVariable String recipient) {
        return chatMessageService.getChatHistoryForUser(username, recipient); // Fetch private messages between two
                                                                              // users
    }

    @MessageMapping("/chat.privateMessages/{sender}/{recipient}")
    public void sendPrivateMessage(@Payload BanquetChatMessage chatMessage,
            @DestinationVariable String sender,
            @DestinationVariable String recipient) {
        if (recipient != null) {
            messagingTemplate.convertAndSendToUser(recipient, "/queue/messages", chatMessage);
            System.out.println("Sending private message to user: " + recipient);

        }
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
