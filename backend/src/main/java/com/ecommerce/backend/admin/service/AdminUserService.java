package com.ecommerce.backend.admin.service;

import com.ecommerce.backend.admin.dto.AdminUserRequest;
import com.ecommerce.backend.admin.dto.AdminUserResponse;
import com.ecommerce.backend.auth.entity.AdminUser;
import com.ecommerce.backend.auth.repository.AdminUserRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ConflictException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<AdminUserResponse> findAll(Pageable pageable) {
        return PagedResponse.of(adminUserRepository.findAll(pageable).map(AdminUserResponse::from));
    }

    @Transactional(readOnly = true)
    public AdminUserResponse findById(Long id) {
        return AdminUserResponse.from(adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdminUser", id)));
    }

    @Transactional
    public AdminUserResponse create(AdminUserRequest req) {
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new BadRequestException("Password is required when creating an admin user");
        }
        if (adminUserRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email already in use: " + req.getEmail());
        }
        AdminUser user = AdminUser.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .role(req.getRole())
                .active(req.isActive())
                .build();
        return AdminUserResponse.from(adminUserRepository.save(user));
    }

    @Transactional
    public AdminUserResponse update(Long id, AdminUserRequest req) {
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdminUser", id));
        if (!user.getEmail().equals(req.getEmail()) && adminUserRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email already in use: " + req.getEmail());
        }
        user.setEmail(req.getEmail());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setRole(req.getRole());
        user.setActive(req.isActive());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        return AdminUserResponse.from(adminUserRepository.save(user));
    }

    @Transactional
    public void delete(Long id, Long requestingAdminId) {
        if (id.equals(requestingAdminId)) {
            throw new BadRequestException("You cannot delete your own admin account");
        }
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AdminUser", id));
        adminUserRepository.delete(user);
    }
}
