package com.example.demo.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "employee_shifts") // Maps the class to the employee_shifts table in the database
public class BanquetShift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Maps AUTO_INCREMENT
    @Column(name = "shift_id")
    private Long shiftId;

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "shift_start_date", nullable = false)
    private LocalDateTime shiftStartDate;

    @Column(name = "shift_end_date", nullable = false)
    private LocalDateTime shiftEndDate;

    @Column(name = "description")
    private String description;

    // Getters and Setters
    public Long getShiftId() {
        return shiftId;
    }

    public void setShiftId(Long shiftId) {
        this.shiftId = shiftId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getShiftStartDate() {
        return shiftStartDate;
    }

    public void setShiftStartDate(LocalDateTime shiftStartDate) {
        this.shiftStartDate = shiftStartDate;
    }

    public LocalDateTime getShiftEndDate() {
        return shiftEndDate;
    }

    public void setShiftEndDate(LocalDateTime shiftEndDate) {
        this.shiftEndDate = shiftEndDate;
    } 

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "BanquetShift{" +
                "shiftId=" + shiftId +
                ", accountId='" + accountId +
                ", eventId='" + eventId +
                ", shiftStartDate=" + shiftStartDate +
                ", shiftEndDate=" + shiftEndDate +
                ", description=" + description + '\'' +
                '}';
    }
}
