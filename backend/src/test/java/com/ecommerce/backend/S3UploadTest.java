package com.ecommerce.backend;

import com.ecommerce.backend.upload.dto.UploadResponse;
import com.ecommerce.backend.upload.service.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
public class S3UploadTest {

    @Autowired
    private StorageService storageService;

    @Test
    public void testActualUpload() {
        try {
            System.out.println("====== STARTING INTEGRATION UPLOAD TEST ======");
            
            MockMultipartFile mockFile = new MockMultipartFile(
                "file", 
                "test-image.png", 
                "image/png", 
                "dummy image content".getBytes()
            );

            UploadResponse response = storageService.upload(mockFile, "test-folder");
            System.out.println("====== UPLOAD SUCCESSFUL ======");
            System.out.println("Uploaded URL: " + response.getUrl());
            System.out.println("Public ID: " + response.getPublicId());
            System.out.println("File Size: " + response.getFileSize() + " bytes");
        } catch (Exception e) {
            System.out.println("====== UPLOAD FAILED ======");
            e.printStackTrace();
        }
    }
}
