package com.ecommerce.backend.gallery.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

/**
 * Request body for POST /api/gallery/batch
 * Used when the admin frontend pre-uploads files via /api/upload/batch and then
 * registers the resulting URLs into the gallery table without re-uploading.
 */
@Data
public class GalleryBatchRequest {

    @NotEmpty(message = "images list must not be empty")
    @Valid
    private List<ImageEntry> images;

    @Data
    public static class ImageEntry {

        /** Publicly accessible URL of the already-uploaded image (required). */
        @jakarta.validation.constraints.NotBlank(message = "imageUrl is required")
        private String imageUrl;

        /** Optional alt text for accessibility / SEO. */
        private String altText;

        /** Optional human-readable title. */
        private String title;
    }
}
