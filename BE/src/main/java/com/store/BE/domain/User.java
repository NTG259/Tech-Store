package com.store.BE.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    @NotBlank(message = "Email cannot null")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password cannot null")
    private String password;

    private String fullName;

    private String address;

    private String phoneNumber;

    private Boolean active = true;

    private String avatar;

    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;

//    @PrePersist
//    private void handleBeforeCreate() {
//        createdAt = Instant.now();
//        Optional<String> currentUser =  SecurityUtils.getCurrentUserLogin();
//        this.createdBy = currentUser.orElse("");
//    }
//
//    @PreUpdate
//    public void handleUpdatedAt() {
//        this.updatedAt = Instant.now();
//        Optional<String> currentUser =  SecurityUtils.getCurrentUserLogin();
//        this.updatedBy = currentUser.orElse("");
//    }
}