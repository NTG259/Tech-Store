package com.store.BE.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String fullName;

    private String address;

    private String phoneNumber;

    private String avatar;

    private Boolean active;
}
