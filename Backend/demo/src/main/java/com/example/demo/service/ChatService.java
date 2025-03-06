package com.example.demo.service;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.ChatDTO;
import com.example.demo.dto.DTOMapper;
import com.example.demo.entity.BanquetAccount;
import com.example.demo.entity.BanquetChat;
import com.example.demo.entity.BanquetChatMessage;
import com.example.demo.repository.ChatRepository;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import com.example.demo.repository.BanquetAccountRepository;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private BanquetAccountRepository accountRepository;
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

    public List<BanquetChat> getAll() {
        return chatRepository.findAll();
    }

    public BanquetChat createChat(String name, List<Long> accountIds) {

        BanquetChat chat = new BanquetChat();
        chat.setName(name);

        // Fetch accounts from the database and associate them with the chat
        List<BanquetAccount> accounts = accountRepository.findAllById(accountIds);
        chat.setAccounts(accounts);
        return chatRepository.save(chat);
    }

    @Transactional(readOnly = true)
    public ChatDTO getChatWithParticipants(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        return DTOMapper.mapToChatDTO(chat);
    }

    @Transactional(readOnly = true)
    public List<AccountDTO> getChatParticipants(Long chatId) {
        BanquetChat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        return chat.getAccounts().stream()
                .map(DTOMapper::mapToAccountDTO)
                .collect(Collectors.toList());
    }

    public void removeAccountFromChat(Long chatId, Long accountId) {
        BanquetChat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        BanquetAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!chat.getAccounts().contains(account)) {
            throw new RuntimeException("Account is not part of this chat");
        }

        chat.getAccounts().remove(account);
        chatRepository.save(chat);
    }

    public void addAccountToChat(Long chatId, Long accountId) {
        BanquetChat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        BanquetAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!chat.getAccounts().contains(account)) {
            chat.getAccounts().add(account);
            chatRepository.save(chat);
        }
    }

}