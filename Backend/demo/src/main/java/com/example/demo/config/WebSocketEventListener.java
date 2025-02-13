package com.example.demo.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.demo.entity.BanquetAccount;
import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.entity.messageType;
import com.google.protobuf.Extension.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.experimental.var;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String name = (String) headerAccessor.getSessionAttributes().get("name");
        if (name != null) {
            log.info("user disconnected: {}", name);
            var chatMessage = BanquetChatMessage.builder()
                    .type(messageType.LEAVE)
                    .sender(name)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}