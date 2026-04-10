package com.store.BE.utils.convert;

import com.store.BE.domain.user.User;
import com.store.BE.domain.response.UserResponseDTO;

public class UserConvert {
    public static UserResponseDTO convertToUserResponseDTO(User user) {
        UserResponseDTO rs = new UserResponseDTO();
        rs.setId(user.getId());
        rs.setFullName(user.getFullName());
        rs.setAddress(user.getAddress());
        rs.setEmail(user.getEmail());
        rs.setPhoneNumber(user.getPhoneNumber());
        rs.setAvatar(user.getAvatar());
        rs.setRole(user.getRole());
        rs.setIsEnabled(user.isEnabled());
        rs.setCityId(user.getCityId());
        rs.setWardId(user.getWardId());
        return rs;
    }
}
