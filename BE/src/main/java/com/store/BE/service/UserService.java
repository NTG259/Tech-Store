package com.store.BE.service;

import com.store.BE.domain.dto.CreateUserByAdminDTO;
import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserByAdminDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.domain.search.UserSearchRequest;
import com.store.BE.domain.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    public ApiResponse<UserResponseDTO> createUser(CreateUserDTO userDto);
    public ApiResponse<Void> deleteUser(Long id);
    public ApiResponse<UserResponseDTO> updateUser(Long id, UpdateUserDTO dto);
    public ApiResponse<List<UserResponseDTO>> getAllUsers();
    public PaginationResponse<UserResponseDTO> getAllUsersPagination(UserSearchRequest req, Pageable pageable);
    public ApiResponse<UserResponseDTO> createUserByAdmin(CreateUserByAdminDTO userDto);
    public ApiResponse<UserResponseDTO> updateUserByAdmin(Long id, UpdateUserByAdminDTO dto);
    public ApiResponse<Void> disableAccount(Long id);
    public User handleFindUserByEmail(String email);
    public void updateUserToken(String token, String email);
    public User getUserByEmailAndRefreshToken(String email, String token);
    public ApiResponse<UserResponseDTO> getUserById(Long id);
}
