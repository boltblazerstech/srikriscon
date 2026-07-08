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

    private boolean isMockR2() {
        String endpoint = r2Properties.getEndpoint();
        log.info("isMockR2 check - s3Client is null: {}, endpoint: {}", s3Client == null, endpoint);
        boolean isMock = s3Client == null || 
               endpoint == null || 
               endpoint.isEmpty() || 
               endpoint.contains("your-account-id") ||
               endpoint.contains("dummy") ||
               endpoint.contains("mock");
        log.info("isMockR2 result: {}", isMock);
        return isMock;
    }

    public UploadResponse upload(MultipartFile file, String folder) {
        validateFile(file);

        if (isMockR2()) {
            log.info("Using local storage for file upload.");
            return uploadLocal(file, folder);
        }

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

        } catch (Exception e) {
            log.error("Error uploading file to R2 storage: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    private UploadResponse uploadLocal(MultipartFile file, String folder) {
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;
        String relativePath = (folder != null ? folder + "/" : "") + filename;
        
        java.nio.file.Path targetPath = java.nio.file.Paths.get("uploads", folder != null ? folder : "", filename).toAbsolutePath();
        
        try {
            java.nio.file.Files.createDirectories(targetPath.getParent());
            java.nio.file.Files.write(targetPath, file.getBytes());
            
            String backendUrl = "http://localhost:8080"; 
            String publicUrl = backendUrl + "/uploads/" + relativePath;
            
            return UploadResponse.builder()
                    .url(publicUrl)
                    .publicId(relativePath)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .build();
        } catch (IOException e) {
            log.error("Failed to save file locally: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to upload file locally: " + e.getMessage());
        }
    }

    public void delete(String publicId) {
        if (isMockR2()) {
            deleteLocal(publicId);
            return;
        }
        if (s3Client == null) throw new BadRequestException("File storage is not configured");
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(r2Properties.getBucket())
                .key(publicId)
                .build());
    }

    private void deleteLocal(String publicId) {
        java.nio.file.Path targetPath = java.nio.file.Paths.get("uploads", publicId).toAbsolutePath();
        try {
            java.nio.file.Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            log.error("Failed to delete local file: {}", e.getMessage(), e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("File is empty");
        if (file.getSize() > MAX_SIZE_BYTES) throw new BadRequestException("File exceeds 10 MB limit");
        if (!ALLOWED_TYPES.contains(file.getContentType()))
            throw new BadRequestException("File type not allowed: " + file.getContentType());
    }

    public String extractPublicId(String url) {
        if (url == null || url.isEmpty()) return null;
        try {
            java.net.URI uri = new java.net.URI(url);
            String path = uri.getPath();
            if (path == null) return null;
            if (path.startsWith("/uploads/")) {
                path = path.substring("/uploads/".length());
            }
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            return path;
        } catch (Exception e) {
            log.warn("Failed to extract publicId from url {}: {}", url, e.getMessage());
            return null;
        }
    }

    public void deleteByUrl(String url) {
        String publicId = extractPublicId(url);
        if (publicId != null && !publicId.isEmpty()) {
            delete(publicId);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
