package com.store.BE.service.implement;

import com.store.BE.domain.dto.CreateUserByAdminDTO;
import com.store.BE.domain.dto.UpdateUserByAdminDTO;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.UserSearchRequest;
import com.store.BE.domain.user.User;
import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.repository.UserRepository;
import com.store.BE.service.UserService;
import com.store.BE.utils.convert.PaginationUtil;
import com.store.BE.utils.convert.UserConvert;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse<UserResponseDTO> createUser(CreateUserDTO userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXIST);
        }

        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setAddress(userDto.getAddress());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhoneNumber(userDto.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
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

    public PaginationResponse<UserResponseDTO> getAllUsersPagination(UserSearchRequest req, Pageable pageable) {
        Specification<User> spec = UserSpecification.filter(req);
        Page<User> users = this.userRepository.findAll(spec, pageable);
        Page<UserResponseDTO> responseDTOS = users.map(UserConvert::convertToUserResponseDTO);
        return PaginationUtil.convertResponse(responseDTOS);
    }

    public ApiResponse<UserResponseDTO> createUserByAdmin(CreateUserByAdminDTO userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXIST);
        }

        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setAddress(userDto.getAddress());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhoneNumber(userDto.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setAvatar(userDto.getAvatar());
        newUser.setRole(userDto.getRole());

        newUser = this.userRepository.save(newUser);
        return new ApiResponse<>(UserConvert.convertToUserResponseDTO(newUser), "Tạo người dùng thành công", null, HttpStatus.CREATED.value());
    }

    public ApiResponse<UserResponseDTO> updateUserByAdmin(Long id, UpdateUserByAdminDTO dto) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setEnabled(dto.getIsEnabled());
        user.setAddress(dto.getAddress());
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAvatar(dto.getAvatar());
        user.setRole(dto.getRole());

        User updatedUser = this.userRepository.saveAndFlush(user);
        return new ApiResponse<>(UserConvert.convertToUserResponseDTO(updatedUser), "Cập nhật thành công", null, HttpStatus.OK.value());
    }

    public ApiResponse<Void> disableAccount(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return new ApiResponse<>(null, "Xóa tài khoản thành công", null, HttpStatus.OK.value());
    }

    public User handleFindUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    public void updateUserToken(String token, String email) {
        User user = this.userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setRefreshToken(token);
        this.userRepository.save(user);
    }

    public User getUserByEmailAndRefreshToken(String email, String token) {
        return this.userRepository.findByEmailAndRefreshToken(email, token)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
    }

    public Long totalUser() {
        return this.userRepository.count();
    }
}