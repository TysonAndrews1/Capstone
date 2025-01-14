package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.BanquetEvent;
import com.example.demo.repository.BanquetEventRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Lis;import java.util.stream.Collectors;
                                                            // 

@CrossOrigin(origins =  allowedHeaders = "*")
tController // Tells Spring to handle any 


@Autowired // Allows Sprig to use Banqutate BanquetEventRepository r

ic  return repos




tore the loacal tie and dat


akes a qutEvent> allEvents = repository.

event with today date and timer allEvets.stream().filter(event -> {
"past".

rn event.getEventEndDate().isBs



    .collect(Collectors.toList());
}@

    return repository.save(event);
}

eteMapping("/{eventId}") // Create a delete method byeent ID
ic ResponseEntity<String> deleteEvent(@PathV

em.out.println("Delete r
heck if the event exists in therepository.existsById(eventId)) {   //D
repository.deleteById(eventId);
return ResponseEntity.ok("Event was deleted successfully.")}  
        
        

    