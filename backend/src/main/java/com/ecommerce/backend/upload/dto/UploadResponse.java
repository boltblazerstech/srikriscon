package com.ecommerce.backend.upload.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadResponse {
    private String url;
    private String publicId;
    private String fileName;
    private long fileSize;
    private String mimeType;
    private Integer width;
    private Integer height;
}
