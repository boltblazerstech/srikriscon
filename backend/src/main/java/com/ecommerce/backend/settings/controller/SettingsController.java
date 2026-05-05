package com.ecommerce.backend.settings.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.settings.dto.SettingRequest;
import com.ecommerce.backend.settings.entity.Setting;
import com.ecommerce.backend.settings.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping("/public")
    public ApiResponse<Map<String, String>> publicSettings() {
        return ApiResponse.success(settingsService.findPublic());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<Map<String, String>> all() {
        return ApiResponse.success(settingsService.findAll());
    }

    @GetMapping("/group/{group}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<Map<String, String>> byGroup(@PathVariable String group) {
        return ApiResponse.success(settingsService.findByGroup(group));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<Setting> upsert(@Valid @RequestBody SettingRequest req) {
        return ApiResponse.success(settingsService.upsert(req));
    }

    @PutMapping("/batch")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<Setting>> upsertBatch(@RequestBody List<@Valid SettingRequest> requests) {
        return ApiResponse.success(settingsService.upsertBatch(requests));
    }

    @DeleteMapping("/{key}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<Void> delete(@PathVariable String key) {
        settingsService.delete(key);
        return ApiResponse.success("Setting deleted");
    }
}
