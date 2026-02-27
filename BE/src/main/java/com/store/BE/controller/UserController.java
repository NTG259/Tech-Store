package com.store.BE.controller;

import com.store.BE.domain.User;
import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.RestResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/users")
@AllArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<RestResponse<UserResponseDTO>> createUser(
            @RequestBody CreateUserDTO createUserDTO) {
        UserResponseDTO userResponse = this.userService.createUser(createUserDTO);
        if (userResponse == null) {
            return ResponseEntity
                    .badRequest()
                    .body(RestResponse.of(400, "Create failed", null));
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(RestResponse.of(201, "Create user success", userResponse));
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
