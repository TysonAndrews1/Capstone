package com.example.demo.service;


import com.example.demo.entity.BanquetEmployee;
import com.example.demo.repository.BanquetEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BanquetEmployeeService {

    @Autowired
    private BanquetEmployeeRepository employeeRepository;

    public List<BanquetEmployee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
