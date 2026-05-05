package com.ecommerce.backend.gallery.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.gallery.dto.GalleryBatchRequest;
import com.ecommerce.backend.gallery.dto.GalleryReorderRequest;
import com.ecommerce.backend.gallery.entity.GalleryImage;
import com.ecommerce.backend.gallery.service.GalleryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
@Tag(name = "Gallery")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping
    @Operation(summary = "List gallery images (paginated)")
    public ApiResponse<PagedResponse<GalleryImage>> list(@PageableDefault(size = 30) Pageable pageable) {
        return ApiResponse.success(galleryService.findAll(pageable));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload an image to the gallery")
    public ApiResponse<GalleryImage> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "title", required = false) String title) {
        return ApiResponse.success(galleryService.upload(file, altText, title));
    }

    @PostMapping("/batch")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register batch of pre-uploaded image URLs into the gallery (no re-upload)")
    public ApiResponse<List<GalleryImage>> registerBatch(@Valid @RequestBody GalleryBatchRequest req) {
        return ApiResponse.success(galleryService.registerBatch(req));
    }

    @PutMapping("/reorder")
    @Operation(summary = "Reorder gallery images — pass ordered list of IDs")
    public ApiResponse<Void> reorder(@Valid @RequestBody GalleryReorderRequest req) {
        galleryService.reorder(req);
        return ApiResponse.success("Gallery reordered");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a gallery image and its R2 object")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        galleryService.delete(id);
        return ApiResponse.success("Image deleted");
    }
}
