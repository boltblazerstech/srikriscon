package com.ecommerce.backend.settings.service;

import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.settings.dto.SettingRequest;
import com.ecommerce.backend.settings.entity.Setting;
import com.ecommerce.backend.settings.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingRepository settingRepository;

    @Transactional(readOnly = true)
    public Map<String, String> findPublic() {
        return settingRepository.findByIsPublicTrue().stream()
                .collect(Collectors.toMap(Setting::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    @Transactional(readOnly = true)
    public Map<String, String> findAll() {
        return settingRepository.findAll().stream()
                .collect(Collectors.toMap(Setting::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    @Transactional(readOnly = true)
    public Map<String, String> findByGroup(String group) {
        return settingRepository.findByGroup(group).stream()
                .collect(Collectors.toMap(Setting::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    @Transactional
    public Setting upsert(SettingRequest req) {
        Setting setting = settingRepository.findByKey(req.getKey())
                .orElse(Setting.builder().key(req.getKey()).build());
        setting.setValue(req.getValue());
        if (req.getGroup() != null) setting.setGroup(req.getGroup());
        if (req.getDescription() != null) setting.setDescription(req.getDescription());
        setting.setPublic(req.isPublic());
        return settingRepository.save(setting);
    }

    @Transactional
    public List<Setting> upsertBatch(List<SettingRequest> requests) {
        return requests.stream().map(this::upsert).collect(Collectors.toList());
    }

    @Transactional
    public void delete(String key) {
        Setting s = settingRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting", "key", key));
        settingRepository.delete(s);
    }

    public String getValue(String key, String defaultValue) {
        return settingRepository.findByKey(key).map(Setting::getValue).orElse(defaultValue);
    }
}
