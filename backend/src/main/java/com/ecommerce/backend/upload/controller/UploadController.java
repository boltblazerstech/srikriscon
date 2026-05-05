package com.ecommerce.backend.upload.controller;

import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.upload.dto.UploadResponse;
import com.ecommerce.backend.upload.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
@Tag(name = "Upload")
public class UploadController {

    private final StorageService storageService;

    @PostMapping
    @Operation(summary = "Upload a single file to R2")
    public ApiResponse<UploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        return ApiResponse.success(storageService.upload(file, folder));
    }

    @PostMapping("/batch")
    @Operation(summary = "Upload multiple files to R2 (max 10 per request)")
    public ApiResponse<List<UploadResponse>> uploadBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        if (files.length > 10) {
            throw new BadRequestException("Cannot upload more than 10 files at once");
        }
        List<UploadResponse> results = Arrays.stream(files)
                .map(f -> storageService.upload(f, folder))
                .collect(Collectors.toList());
        return ApiResponse.success(results);
    }

    @DeleteMapping
    @Operation(summary = "Delete a file from R2 by its public ID (path key)")
    public ApiResponse<Void> delete(@RequestParam("publicId") String publicId) {
        storageService.delete(publicId);
        return ApiResponse.success("File deleted");
    }
}
