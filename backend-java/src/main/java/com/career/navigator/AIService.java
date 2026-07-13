package com.career.navigator;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;

@Service
public class AIService {

    // Use a constant for the URL so it's easy to change later
    private static final String PYTHON_URL = "http://127.0.0.1:5000/process-resume";

    public String callPython(MultipartFile file, String interest) throws IOException {
        RestTemplate rest = new RestTemplate();

        // 1. Create temporary file
        File tempFile = File.createTempFile("upload_", "_" + file.getOriginalFilename());
        
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }

        try {
            // 2. Prepare the Request Body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile));
            body.add("interest", interest);

            // 3. Set Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

            // 4. Call Python Engine
            System.out.println("🚀 Sending request to Python AI Engine...");
            String response = rest.postForObject(PYTHON_URL, entity, String.class);
            System.out.println("✅ Python Analysis Received!");
            
            return response;

        } catch (Exception e) {
            System.err.println("❌ Error communicating with Python: " + e.getMessage());
            throw e;
        } finally {
            // 5. CLEANUP: Delete the temp file so your computer stays clean
            if (tempFile.exists()) {
                Files.delete(tempFile.toPath());
                System.out.println("🧹 Temp file deleted.");
            }
        }
    }
}