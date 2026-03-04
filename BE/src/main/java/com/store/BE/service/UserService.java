package com.store.BE.service;

import com.store.BE.domain.User;
import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.repo.UserRepository;
import com.store.BE.utils.convert.UserConvert;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ApiResponse<UserResponseDTO> createUser(CreateUserDTO userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            // Sử dụng mã lỗi cụ thể từ Enum
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User newUser = new User();
        // ... set fields (email, address, fullName, password, avatar ...)
        newUser.setEmail(userDto.getEmail());
        newUser.setAddress(userDto.getAddress());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhoneNumber(userDto.getPhoneNumber());
        newUser.setPassword(userDto.getPassword());
        newUser.setAvatar(userDto.getAvatar());

        newUser = this.userRepository.save(newUser);
        return new ApiResponse<>(UserConvert.convertToUserResponseDTO(newUser), "Tạo người dùng thành công", null, HttpStatus.CREATED.value());
    }

    public ApiResponse<UserResponseDTO> getUserById(Long id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return new ApiResponse<>(UserConvert.convertToUserResponseDTO(user), "Lấy thông tin thành công", null, HttpStatus.OK.value());
    }

    public ApiResponse<Void> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        userRepository.deleteById(id);
        return new ApiResponse<>(null, "Xóa người dùng thành công", null, HttpStatus.OK.value());
    }

    public ApiResponse<UserResponseDTO> updateUser(Long id, UpdateUserDTO dto) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setActive(dto.getActive());
        user.setAddress(dto.getAddress());
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAvatar(dto.getAvatar());

        User updatedUser = this.userRepository.saveAndFlush(user);
        return new ApiResponse<>(UserConvert.convertToUserResponseDTO(updatedUser), "Cập nhật thành công", null, HttpStatus.OK.value());
    }

    public ApiResponse<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> list = this.userRepository.findAll().stream()
                .map(UserConvert::convertToUserResponseDTO)
                .collect(Collectors.toList());
        return new ApiResponse<>(list, "Lấy danh sách thành công", null, HttpStatus.OK.value());
    }
}