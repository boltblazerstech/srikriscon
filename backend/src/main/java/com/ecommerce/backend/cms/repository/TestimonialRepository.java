package com.ecommerce.backend.cms.repository;

import com.ecommerce.backend.cms.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByActiveTrueOrderBySortOrderAsc();
    List<Testimonial> findAllByOrderBySortOrderAsc();
}
