// Reference: https://masteringbackend.com/posts/spring-boot
// Reference: Also copied code from BanquetAccount.java

package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_attendance") //Maps the class to the employee_attendance table in the database
public class EmployeeAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @Column(name = "employee_id", nullable = false, length = 6)
    private String employeeId;

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "clock_in_time", nullable = false)
    private String clockInTime;

    @Column(name = "clock_out_time", nullable = false)
    private String clockOutTime;

    @Column(name = "status", nullable = false)
    private String status;

    public Long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getClockInTime() {
        return clockInTime;
    }

    public void setClockInTime(String clockInTime) {
        this.clockInTime = clockInTime;
    }

    public String getClockOutTime() {
        return clockOutTime;
    }

    public void setClockOutTime(String clockOutTime) {
        this.clockOutTime = clockOutTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "EmployeeAttendance{" +
                "attendanceId=" + attendanceId +
                ", employeeId='" + employeeId + '\'' +
                ", date='" + date + '\'' +
                ", clockInTime='" + clockInTime + '\'' +
                ", clockOutTime='" + clockOutTime + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}