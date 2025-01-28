package com.example.demo.service;


import com.example.demo.entity.BanquetAccount;
import com.example.demo.repository.BanquetAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BanquetAccountService {

    @Autowired
    private BanquetAccountRepository employeeRepository;

    public List<BanquetAccount> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
