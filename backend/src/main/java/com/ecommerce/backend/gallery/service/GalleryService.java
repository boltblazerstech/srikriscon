package com.ecommerce.backend.gallery.service;

import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.gallery.dto.GalleryBatchRequest;
import com.ecommerce.backend.gallery.dto.GalleryReorderRequest;
import com.ecommerce.backend.gallery.entity.GalleryImage;
import com.ecommerce.backend.gallery.repository.GalleryImageRepository;
import com.ecommerce.backend.upload.dto.UploadResponse;
import com.ecommerce.backend.upload.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public PagedResponse<GalleryImage> findAll(Pageable pageable) {
        return PagedResponse.of(galleryImageRepository.findAll(pageable));
    }

    @Transactional
    public GalleryImage upload(MultipartFile file, String altText, String title) {
        UploadResponse uploaded = storageService.upload(file, "gallery");
        int nextSortOrder = galleryImageRepository.findTopByOrderBySortOrderDesc()
                .map(img -> img.getSortOrder() + 1)
                .orElse(0);
        GalleryImage image = GalleryImage.builder()
                .url(uploaded.getUrl())
                .publicId(uploaded.getPublicId())
                .altText(altText)
                .title(title)
                .fileName(uploaded.getFileName())
                .fileSize(uploaded.getFileSize())
                .mimeType(uploaded.getMimeType())
                .sortOrder(nextSortOrder)
                .build();
        return galleryImageRepository.save(image);
    }

    /**
     * Register a batch of already-uploaded image URLs into the gallery table.
     * Called after the admin frontend pre-uploads files via /api/upload/batch
     * and receives back a list of public URLs.
     */
    @Transactional
    public List<GalleryImage> registerBatch(GalleryBatchRequest req) {
        int base = galleryImageRepository.findTopByOrderBySortOrderDesc()
                .map(img -> img.getSortOrder() + 1)
                .orElse(0);

        List<GalleryImage> images = new java.util.ArrayList<>();
        List<GalleryBatchRequest.ImageEntry> entries = req.getImages();
        for (int i = 0; i < entries.size(); i++) {
            GalleryBatchRequest.ImageEntry entry = entries.get(i);
            GalleryImage image = GalleryImage.builder()
                    .url(entry.getImageUrl())
                    // publicId is null — these images are managed externally by the upload service
                    .altText(entry.getAltText())
                    .title(entry.getTitle())
                    .sortOrder(base + i)
                    .build();
            images.add(galleryImageRepository.save(image));
        }
        return images;
    }

    @Transactional
    public void reorder(GalleryReorderRequest req) {
        for (int i = 0; i < req.getIds().size(); i++) {
            Long id = req.getIds().get(i);
            GalleryImage image = galleryImageRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("GalleryImage", id));
            image.setSortOrder(i);
            galleryImageRepository.save(image);
        }
    }

    @Transactional
    public void delete(Long id) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GalleryImage", id));
        storageService.delete(image.getPublicId());
        galleryImageRepository.delete(image);
    }
}
