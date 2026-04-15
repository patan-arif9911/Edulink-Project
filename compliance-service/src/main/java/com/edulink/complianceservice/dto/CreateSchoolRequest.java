package com.edulink.complianceservice.dto;

import java.time.LocalDate;

public class CreateSchoolRequest {
    private String id;  // Changed from schoolId to id to match identity service
    private String name;
    private String address;
    private String phone;
    private String email;
    private String principalName;
    private LocalDate establishedDate;

    public CreateSchoolRequest() {}

    public CreateSchoolRequest(String id, String name, String address, String phone, String email, String principalName, LocalDate establishedDate) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.principalName = principalName;
        this.establishedDate = establishedDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPrincipalName() { return principalName; }
    public void setPrincipalName(String principalName) { this.principalName = principalName; }

    public LocalDate getEstablishedDate() { return establishedDate; }
    public void setEstablishedDate(LocalDate establishedDate) { this.establishedDate = establishedDate; }
}