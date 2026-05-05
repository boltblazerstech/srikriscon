package com.ecommerce.backend.settings.repository;

import com.ecommerce.backend.settings.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {
    Optional<Setting> findByKey(String key);
    List<Setting> findByGroup(String group);
    List<Setting> findByIsPublicTrue();
}
