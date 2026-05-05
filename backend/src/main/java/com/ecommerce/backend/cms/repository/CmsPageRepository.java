package com.ecommerce.backend.cms.repository;

import com.ecommerce.backend.cms.entity.CmsPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CmsPageRepository extends JpaRepository<CmsPage, Long> {
    Optional<CmsPage> findBySlug(String slug);
    Optional<CmsPage> findBySlugAndStatus(String slug, CmsPage.Status status);
    List<CmsPage> findByStatus(CmsPage.Status status);
    boolean existsBySlug(String slug);
}
