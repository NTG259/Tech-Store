package com.store.BE.domain.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.store.BE.domain.user.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;

    private String fullName;

    private String phoneNumber;

    private String email;

    private String address;

    private String avatar;

    private Role role;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdDate;

}
