package com.edulink.complianceservice.utils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;
    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(this.secret.getBytes());
    }

    public String generateToken(String email, String role, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return this.createToken(claims, email, this.expiration);
    }

    public String generateRefreshToken(String email) {
        return this.createToken(new HashMap<>(), email, this.refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(this.getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return (String)this.extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return (String)this.extractClaim(token, (claims) -> (String)claims.get("role", String.class));
    }

    public String extractUserId(String token) {
        return (String)this.extractClaim(token, (claims) -> (String)claims.get("userId", String.class));
    }

    public Date extractExpiration(String token) {
        return (Date)this.extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = this.extractAllClaims(token);
        return (T)claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return (Claims)Jwts
                .parser()
                .setSigningKey(this.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return this.extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, String email) {
        String tokenEmail = this.extractEmail(token);
        return tokenEmail.equals(email) && !this.isTokenExpired(token);
    }
}
