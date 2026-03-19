package com.store.BE.utils.security;

import com.store.BE.domain.user.User;
import com.store.BE.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component("userDetailService")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) throw new UsernameNotFoundException("User not found");
        User user = optionalUser.get();
        return new CustomUsersDetail(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),
                List.of(() -> user.getRole().name())
        );
    }
}