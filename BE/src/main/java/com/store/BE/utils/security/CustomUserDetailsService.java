//package com.store.B23DCCN259.utils.security;
//
//import com.store.B23DCCN259.domain.User;
//import com.store.B23DCCN259.repo.UserRepository;
//import org.jspecify.annotations.NonNull;
//import org.springframework.security.core.userdetails.*;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    public CustomUserDetailsService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(@NonNull String email) {
//        Optional<User> optionalUser = userRepository.findByEmail(email);
//        if (optionalUser.isEmpty()) throw new UsernameNotFoundException("User not found");
//        User user = optionalUser.get();
//        return org.springframework.security.core.userdetails.User
//                .withUsername(user.getEmail())
//                .password(user.getPassword())
//                .roles("CUSTOMER")
//                .build();
//    }
//}