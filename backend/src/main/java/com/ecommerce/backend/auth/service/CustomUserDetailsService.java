package com.ecommerce.backend.auth.service;

import com.ecommerce.backend.auth.repository.AdminUserRepository;
import com.ecommerce.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Unified UserDetailsService that resolves principals from both the
 * {@code admin_users} table (checked first) and the {@code users} table.
 *
 * <p>To avoid ambiguity, admin and customer emails should be kept distinct
 * at the application level.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;
    private final UserRepository      userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Admin resolution takes priority so SUPER_ADMIN/ADMIN roles are always honoured.
        return adminUserRepository.findByEmail(email)
                .<UserDetails>map(admin -> admin)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "No account found for email: " + email)));
    }
}
