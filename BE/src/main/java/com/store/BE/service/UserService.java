package com.store.BE.service;

import com.store.BE.domain.User;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.repo.UserRepository;
import com.store.BE.utils.convert.UserConvert;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDTO createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DataIntegrityViolationException("Email đã tồn tại");
        }
        User newUser = this.userRepository.save(user);
        return UserConvert.convertToUserResponseDTO(newUser);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserConvert.convertToUserResponseDTO(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        ArrayList<UserResponseDTO> list = new ArrayList<>();
        List<User> users = this.userRepository.findAll();
        for (User user : users) {
            list.add(UserConvert.convertToUserResponseDTO(user));
        }
        return list;
    }
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(dto.getActive());
        user.setAddress(dto.getAddress());
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());

        User updatedUser = this.userRepository.save(user);
        return UserConvert.convertToUserResponseDTO(updatedUser);
    }
}
