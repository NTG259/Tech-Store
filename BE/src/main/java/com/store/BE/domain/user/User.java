package com.store.BE.domain.user;

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

    private boolean enabled = true;

    private String avatar;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;
}