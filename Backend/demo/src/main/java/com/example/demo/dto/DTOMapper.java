package com.example.demo.dto;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.ChatDTO;
import com.example.demo.entity.BanquetAccount;
import com.example.demo.entity.BanquetChat;

import java.util.List;
import java.util.stream.Collectors;

public class DTOMapper {

    public static AccountDTO mapToAccountDTO(BanquetAccount account) {
        if (account == null) {
            return null;
        }

        return new AccountDTO(
                account.getAccountId(),
                account.getFirstName(),
                account.getLastName(),
                account.getEmail(),
                account.getRole());
    }

    public static ChatDTO mapToChatDTO(BanquetChat chat) {
        if (chat == null) {
            return null;
        }

        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getId());
        chatDTO.setName(chat.getName());

        if (chat.getAccounts() != null) {
            List<AccountDTO> participantDTOs = chat.getAccounts().stream()
                    .map(DTOMapper::mapToAccountDTO)
                    .collect(Collectors.toList());
            chatDTO.setParticipants(participantDTOs);
        }

        return chatDTO;
    }
}