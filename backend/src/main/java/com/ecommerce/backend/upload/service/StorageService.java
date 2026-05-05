package com.ecommerce.backend.upload.service;

import com.ecommerce.backend.common.config.R2Properties;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.upload.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class StorageService {

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml");
    private static final long MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private S3Client s3Client;

    private final R2Properties r2Properties;

    public StorageService(R2Properties r2Properties) {
        this.r2Properties = r2Properties;
    }

    public UploadResponse upload(MultipartFile file, String folder) {
        if (s3Client == null) throw new BadRequestException("File storage is not configured");
        validateFile(file);

        String ext = getExtension(file.getOriginalFilename());
        String key = (folder != null ? folder + "/" : "") + UUID.randomUUID() + "." + ext;

        try {
            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(r2Properties.getBucket())
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putReq, RequestBody.fromBytes(file.getBytes()));

            String publicUrl = r2Properties.getPublicUrl() + "/" + key;

            return UploadResponse.builder()
                    .url(publicUrl)
                    .publicId(key)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    public void delete(String publicId) {
        if (s3Client == null) throw new BadRequestException("File storage is not configured");
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(r2Properties.getBucket())
                .key(publicId)
                .build());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("File is empty");
        if (file.getSize() > MAX_SIZE_BYTES) throw new BadRequestException("File exceeds 10 MB limit");
        if (!ALLOWED_TYPES.contains(file.getContentType()))
            throw new BadRequestException("File type not allowed: " + file.getContentType());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
