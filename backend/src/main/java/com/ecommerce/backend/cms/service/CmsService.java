package com.ecommerce.backend.cms.service;

import com.ecommerce.backend.cms.dto.CmsPageRequest;
import com.ecommerce.backend.cms.dto.CmsPageResponse;
import com.ecommerce.backend.cms.entity.CmsPage;
import com.ecommerce.backend.cms.repository.CmsPageRepository;
import com.ecommerce.backend.common.exception.ConflictException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CmsService {

    private final CmsPageRepository cmsPageRepository;

    @Transactional(readOnly = true)
    public List<CmsPageResponse> findPublished() {
        return cmsPageRepository.findByStatus(CmsPage.Status.PUBLISHED)
                .stream().map(CmsPageResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CmsPageResponse> findAll() {
        return cmsPageRepository.findAll().stream().map(CmsPageResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CmsPageResponse findPublishedBySlug(String slug) {
        return CmsPageResponse.from(
                cmsPageRepository.findBySlugAndStatus(slug, CmsPage.Status.PUBLISHED)
                        .orElseThrow(() -> new ResourceNotFoundException("Page", "slug", slug)));
    }

    @Transactional(readOnly = true)
    public CmsPageResponse findBySlug(String slug) {
        return CmsPageResponse.from(
                cmsPageRepository.findBySlug(slug)
                        .orElseThrow(() -> new ResourceNotFoundException("Page", "slug", slug)));
    }

    @Transactional
    public CmsPageResponse create(CmsPageRequest req) {
        if (cmsPageRepository.existsBySlug(req.getSlug())) {
            throw new ConflictException("Slug already in use: " + req.getSlug());
        }
        CmsPage.Status status = req.getStatus();
        if (req.getActive() != null) {
            status = req.getActive() ? CmsPage.Status.PUBLISHED : CmsPage.Status.DRAFT;
        } else if (status == null) {
            status = CmsPage.Status.DRAFT;
        }
        
        CmsPage page = CmsPage.builder()
                .title(req.getTitle()).slug(req.getSlug()).content(req.getContent())
                .excerpt(req.getExcerpt()).status(status)
                .metaTitle(req.getMetaTitle()).metaDescription(req.getMetaDescription())
                .build();
        return CmsPageResponse.from(cmsPageRepository.save(page));
    }

    @Transactional
    public CmsPageResponse update(Long id, CmsPageRequest req) {
        CmsPage page = cmsPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CmsPage", id));
        if (!page.getSlug().equals(req.getSlug()) && cmsPageRepository.existsBySlug(req.getSlug())) {
            throw new ConflictException("Slug already in use: " + req.getSlug());
        }
        page.setTitle(req.getTitle()); page.setSlug(req.getSlug());
        page.setContent(req.getContent()); page.setExcerpt(req.getExcerpt());
        
        CmsPage.Status status = req.getStatus();
        if (req.getActive() != null) {
            status = req.getActive() ? CmsPage.Status.PUBLISHED : CmsPage.Status.DRAFT;
        }
        if (status != null) {
            page.setStatus(status);
        }
        
        page.setMetaTitle(req.getMetaTitle()); page.setMetaDescription(req.getMetaDescription());
        return CmsPageResponse.from(cmsPageRepository.save(page));
    }

    @Transactional
    public void delete(Long id) {
        cmsPageRepository.delete(cmsPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CmsPage", id)));
    }
}
