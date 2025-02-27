//Reference: https://masteringbackend.com/posts/spring-boot
//I use this guide to help me setup the SpringBoot backend server. It provided examples on how to setup and use the basic CRUD operations built into Spring/JPA.

package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.EmployeeVote;
import com.example.demo.repository.EmployeeVoteRepository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/votes")
public class EmployeeVoteController {

    @Autowired
    private EmployeeVoteRepository repository;

    @GetMapping // Display a list of all the votes
    public List<EmployeeVote> getAllVote() {
        return repository.findAll();
    }

    @GetMapping("/{voteId}") // Get a specific vote by ID
    public ResponseEntity<EmployeeVote> getAccountById(@PathVariable Long voteId) {
        // Retrieve the vote by ID using the repository
        Optional<EmployeeVote> vote = repository.findById(voteId);

        if (vote.isPresent()) {
            return ResponseEntity.ok(vote.get()); // Return the event if found
        } else {
            return ResponseEntity.status(404).body(null); // Return 404 if event not found
        }
    }

    @DeleteMapping("/{voteId}")
    public ResponseEntity<String> deleteVote(@PathVariable Long voteId) {
        if (repository.existsById(voteId)) {
            repository.deleteById(voteId);
            return ResponseEntity.ok("Vote was deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Vote not found");
        }
    }

    @PostMapping // Save votes made from the frontend
    public EmployeeVote saveVote(@RequestBody EmployeeVote vote) {
        return repository.save(vote);
    }

    @PutMapping("/{voteId}") // Save change vote
    public ResponseEntity<EmployeeVote> updateVote(@PathVariable Long voteId, @RequestBody EmployeeVote updateVote) {
        return repository.findById(voteId)
        .map(vote -> {
            vote.setAccountId(updateVote.getAccountId());
            vote.setNomineeId(updateVote.getNomineeId());
            vote.setVoteDate(updateVote.getVoteDate());
            vote.setReason(updateVote.getReason());
            vote.setVoteWeight(updateVote.getVoteWeight());
            return ResponseEntity.ok(repository.save(vote));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
