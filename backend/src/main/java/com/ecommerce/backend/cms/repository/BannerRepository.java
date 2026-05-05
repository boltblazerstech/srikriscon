package com.ecommerce.backend.cms.repository;

import com.ecommerce.backend.cms.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrueOrderBySortOrderAsc();
    List<Banner> findAllByOrderBySortOrderAsc();
}
