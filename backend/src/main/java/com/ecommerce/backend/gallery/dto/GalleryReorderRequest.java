package com.ecommerce.backend.gallery.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class GalleryReorderRequest {

    @NotEmpty
    private List<Long> ids;
}
