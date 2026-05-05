package com.ecommerce.backend.cms.service;

import com.ecommerce.backend.cms.dto.TestimonialRequest;
import com.ecommerce.backend.cms.dto.TestimonialResponse;
import com.ecommerce.backend.cms.entity.Testimonial;
import com.ecommerce.backend.cms.repository.TestimonialRepository;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    @Transactional(readOnly = true)
    public List<TestimonialResponse> findActive() {
        return testimonialRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream().map(TestimonialResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TestimonialResponse> findAll() {
        return testimonialRepository.findAllByOrderBySortOrderAsc()
                .stream().map(TestimonialResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public TestimonialResponse create(TestimonialRequest req) {
        Testimonial t = Testimonial.builder()
                .name(req.getName())
                .designation(req.getDesignation())
                .company(req.getCompany())
                .content(req.getContent())
                .rating(req.getRating())
                .imageUrl(req.getImageUrl())
                .sortOrder(req.getSortOrder())
                .active(req.isActive())
                .build();
        return TestimonialResponse.from(testimonialRepository.save(t));
    }

    @Transactional
    public TestimonialResponse update(Long id, TestimonialRequest req) {
        Testimonial t = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id));
        t.setName(req.getName());
        t.setDesignation(req.getDesignation());
        t.setCompany(req.getCompany());
        t.setContent(req.getContent());
        t.setRating(req.getRating());
        t.setImageUrl(req.getImageUrl());
        t.setSortOrder(req.getSortOrder());
        t.setActive(req.isActive());
        return TestimonialResponse.from(testimonialRepository.save(t));
    }

    @Transactional
    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            Testimonial t = testimonialRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id));
            t.setSortOrder(i);
            testimonialRepository.save(t);
        }
    }

    @Transactional
    public void delete(Long id) {
        testimonialRepository.delete(testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id)));
    }
}
