//package com.store.B23DCCN259.utils.security;
//
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//import java.util.*;
//
//@Service
//public class SecurityUtils {
//
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.expiration}")
//    private long expiration;
//
//    public static Optional<String> getCurrentUserLogin() {
//        SecurityContext securityContext = SecurityContextHolder.getContext();
//        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
//    }
//
//    private static String extractPrincipal(Authentication authentication) {
//        if (authentication == null) {
//            return null;
//        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
//            return springSecurityUser.getUsername();
//        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
//            return jwt.getSubject();
//        } else if (authentication.getPrincipal() instanceof String s) {
//            return s;
//        }
//        return null;
//    }
//
//
//    public static Optional<String> getCurrentUserJWT() {
//        SecurityContext securityContext = SecurityContextHolder.getContext();
//        return Optional.ofNullable(securityContext.getAuthentication())
//                .filter(authentication -> authentication.getCredentials() instanceof String)
//                .map(authentication -> (String) authentication.getCredentials());
//    }
//
////    public Jwt checkValidRefreshToken(String token){
////        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
////                getSecretKey()).macAlgorithm(SecurityService.JWT_ALGORITHM).build();
////        try {
////            return jwtDecoder.decode(token);
////        } catch (Exception e) {
////            System.out.println(">>> JWT error: " + e.getMessage());
////            throw e;
////        }
////    }
//
////    private SecretKey getSecretKey() {
////        byte[] keyBytes = Base64.from(jwtKey).decode();
////        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityService.JWT_ALGORITHM.getName());
////    }
//}