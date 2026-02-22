//package com.store.B23DCCN259.service;
//
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
//import org.springframework.security.oauth2.jwt.JwtEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class SecurityService {
//    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;
//    private final JwtEncoder jwtEncoder;
//
//    @Value("${ntg.jwt.base64-secret}")
//    private String jwtKey;
//
//    @Value("${ntg.jwt.access-token-validity-in-seconds}")
//    private long accessTokenExpiration;
//
//    @Value("${ntg.jwt.refresh-token-validity-in-seconds}")
//    private long refreshTokenExpiration;
//
//    public String createAccessToken(String email, LoginResponse loginResponse) {
//        LoginResponse.UserInsideToken userToken = new LoginResponse.UserInsideToken();
//        userToken.setId(loginResponse.getUser().getId());
//        userToken.setName(loginResponse.getUser().getName());
//        userToken.setEmail(loginResponse.getUser().getEmail());
//
//        Instant now = Instant.now();
//        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);
//
//        List<String> roles = new ArrayList<>();
//        roles.add("USER_ROLE");
//
//        // @formatter:off
//        JwtClaimsSet claims = JwtClaimsSet.builder()
//                .issuedAt(now)
//                .expiresAt(validity)
//                .subject(email)
//                .claim("roles", roles)
//                .claim("user", userToken)
//                .build();
//
//        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
//        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
//    }
//
//    public String createRefreshToken(String email, LoginResponse loginResponse) {
//        LoginResponse.UserInsideToken userToken = new LoginResponse.UserInsideToken();
//        userToken.setId(loginResponse.getUser().getId());
//        userToken.setName(loginResponse.getUser().getName());
//        userToken.setEmail(loginResponse.getUser().getEmail());
//        Instant now = Instant.now();
//        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);
//
//        List<String> roles = new ArrayList<>();
//        roles.add("USER_ROLE");
//
//        // @formatter:off
//        JwtClaimsSet claims = JwtClaimsSet.builder()
//                .issuedAt(now)
//                .expiresAt(validity)
//                .subject(email)
//                .claim("roles", roles)
//                .claim("user", userToken)
//                .build();
//
//        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
//        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
//    }
//}