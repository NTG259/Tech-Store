package com.store.BE.repository;

import com.store.BE.domain.dto.UserVipDTO;
import com.store.BE.domain.user.User;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndRefreshToken(String email, String token);

    Page<User> findAll(Specification specification, @NonNull Pageable pageable);

    @Query(value = """
    SELECT u.id as id,
           u.full_name as fullName,
           u.email as email,
           u.role as role,
           SUM(o.total_amount) as totalSpend,
           COUNT(*) as totalOrder
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE u.role = 'USER'
    GROUP BY u.id, u.full_name, u.email, u.role
    ORDER BY totalSpend DESC
    LIMIT 5
""", nativeQuery = true)
    List<UserVipDTO> getTop5UserVip();
}
