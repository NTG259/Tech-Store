package com.store.BE.utils.convert;

import com.store.BE.domain.User;
import com.store.BE.domain.response.UserResponseDTO;

public class UserConvert {
    public static UserResponseDTO convertToUserResponseDTO(User user) {
        UserResponseDTO rs = new UserResponseDTO();
        rs.setId(user.getId());
        rs.setName(user.getFullName());
        rs.setAddress(user.getAddress());
        rs.setCreatedDate(user.getCreatedAt());
        rs.setEmail(user.getEmail());
        rs.setPhoneNumber(user.getPhoneNumber());
        rs.setAvatar(user.getAvatar());
        return rs;
    }
}
