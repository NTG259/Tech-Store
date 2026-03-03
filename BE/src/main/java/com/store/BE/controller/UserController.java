package com.store.BE.controller;

import com.store.BE.domain.User;
import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collector;

@Controller
@RequestMapping("/api/users")
@AllArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(
            @Valid
            @RequestBody CreateUserDTO createUserDTO) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.userService.createUser(createUserDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UpdateUserDTO dto, @PathVariable Long id) {
        UserResponseDTO userResponseDTO = this.userService.updateUser(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(userResponseDTO);
    }

    @GetMapping("")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        this.userService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
