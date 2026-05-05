package com.ecommerce.backend.cms.controller;

import com.ecommerce.backend.cms.dto.ReorderRequest;
import com.ecommerce.backend.cms.dto.TestimonialRequest;
import com.ecommerce.backend.cms.dto.TestimonialResponse;
import com.ecommerce.backend.cms.service.TestimonialService;
import com.ecommerce.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cms/testimonials")
@RequiredArgsConstructor
@Tag(name = "CMS - Testimonials")
public class TestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping
    @Operation(summary = "List active testimonials (public)")
    public ApiResponse<List<TestimonialResponse>> listActive() {
        return ApiResponse.success(testimonialService.findActive());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: list all testimonials")
    public ApiResponse<List<TestimonialResponse>> listAll() {
        return ApiResponse.success(testimonialService.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: create testimonial")
    public ApiResponse<TestimonialResponse> create(@Valid @RequestBody TestimonialRequest req) {
        return ApiResponse.success("Testimonial created", testimonialService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update testimonial")
    public ApiResponse<TestimonialResponse> update(@PathVariable Long id, @Valid @RequestBody TestimonialRequest req) {
        return ApiResponse.success("Testimonial updated", testimonialService.update(id, req));
    }

    @PutMapping("/reorder")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: reorder testimonials — pass ordered list of IDs")
    public ApiResponse<Void> reorder(@Valid @RequestBody ReorderRequest req) {
        testimonialService.reorder(req.getIds());
        return ApiResponse.success("Testimonials reordered");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: delete testimonial")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        testimonialService.delete(id);
        return ApiResponse.success("Testimonial deleted");
    }
}
