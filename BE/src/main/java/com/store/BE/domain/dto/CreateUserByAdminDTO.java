package com.store.BE.domain.dto;

import com.store.BE.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserByAdminDTO {
    private String email;

    private String password;

    private String fullName;

    private String address;

    private String phoneNumber;

    private String avatar;

    private Role role;
}
