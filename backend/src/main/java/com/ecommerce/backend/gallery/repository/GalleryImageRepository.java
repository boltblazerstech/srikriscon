package com.ecommerce.backend.gallery.repository;

import com.ecommerce.backend.gallery.entity.GalleryImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    Page<GalleryImage> findByMimeTypeStartingWith(String mimeTypePrefix, Pageable pageable);
    Optional<GalleryImage> findTopByOrderBySortOrderDesc();
}
