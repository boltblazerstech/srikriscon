package com.ecommerce.backend.admin.service;

import com.ecommerce.backend.admin.dto.CustomerRequest;
import com.ecommerce.backend.admin.dto.CustomerResponse;
import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.auth.repository.UserRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<CustomerResponse> findAll(Pageable pageable) {
        Page<User> customers = userRepository.findByRole(User.Role.CUSTOMER, pageable);
        return PagedResponse.of(customers.map(CustomerResponse::from));
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new BadRequestException("User is not a customer");
        }
        return CustomerResponse.from(customer);
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest req) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
        
        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new BadRequestException("User is not a customer");
        }

        // Email conflict check
        if (!customer.getEmail().equalsIgnoreCase(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already in use by another user");
        }

        customer.setFirstName(req.getFirstName().trim());
        customer.setLastName(req.getLastName().trim());
        customer.setEmail(req.getEmail().toLowerCase().trim());
        customer.setPhone(req.getPhone() == null || req.getPhone().isBlank() ? null : req.getPhone().trim());
        customer.setActive(req.isActive());

        User saved = userRepository.save(customer);
        return CustomerResponse.from(saved);
    }

    @Transactional
    public void delete(Long id) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new BadRequestException("User is not a customer");
        }
        userRepository.delete(customer);
    }
}
