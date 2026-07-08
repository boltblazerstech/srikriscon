package com.ecommerce.backend;

import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByRole() {
        // Given
        User customer1 = User.builder()
                .email("testcustomer1@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("Customer")
                .role(User.Role.CUSTOMER)
                .active(true)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User admin1 = User.builder()
                .email("testadmin1@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("Admin")
                .role(User.Role.ADMIN)
                .active(true)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(customer1);
        userRepository.save(admin1);

        // When
        Page<User> customers = userRepository.findByRole(User.Role.CUSTOMER, PageRequest.of(0, 10));

        // Then
        assertNotNull(customers);
        assertEquals(1, customers.getTotalElements());
        assertEquals("testcustomer1@example.com", customers.getContent().get(0).getEmail());
    }
}
