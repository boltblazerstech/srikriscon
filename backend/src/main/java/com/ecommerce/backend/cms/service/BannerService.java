package com.ecommerce.backend.cms.service;

import com.ecommerce.backend.cms.dto.BannerRequest;
import com.ecommerce.backend.cms.dto.BannerResponse;
import com.ecommerce.backend.cms.entity.Banner;
import com.ecommerce.backend.cms.repository.BannerRepository;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> findActive() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream().map(BannerResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findAll() {
        return bannerRepository.findAllByOrderBySortOrderAsc()
                .stream().map(BannerResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public BannerResponse create(BannerRequest req) {
        Banner banner = Banner.builder()
                .title(req.getTitle())
                .subtitle(req.getSubtitle())
                .imageUrl(req.getImageUrl())
                .linkUrl(req.getLinkUrl())
                .sortOrder(req.getSortOrder())
                .active(req.isActive())
                .build();
        return BannerResponse.from(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse update(Long id, BannerRequest req) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", id));
        banner.setTitle(req.getTitle());
        banner.setSubtitle(req.getSubtitle());
        banner.setImageUrl(req.getImageUrl());
        banner.setLinkUrl(req.getLinkUrl());
        banner.setSortOrder(req.getSortOrder());
        banner.setActive(req.isActive());
        return BannerResponse.from(bannerRepository.save(banner));
    }

    @Transactional
    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            Banner banner = bannerRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Banner", id));
            banner.setSortOrder(i);
            bannerRepository.save(banner);
        }
    }

    @Transactional
    public void delete(Long id) {
        bannerRepository.delete(bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", id)));
    }
}
