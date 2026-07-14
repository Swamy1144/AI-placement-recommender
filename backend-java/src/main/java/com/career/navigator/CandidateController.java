package com.career.navigator;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AIService {

    // Automatically reads the live Render URL from application.properties
    @Value("${ai.engine.url}")
    private String aiEngineUrl;

    public String callPython(MultipartFile file, String interest) throws Exception {
        // 1. Build the exact endpoint URL target
        String pythonUrl = aiEngineUrl + "/process-resume";

        RestTemplate restTemplate = new RestTemplate();

        // 2. Set headers for standard Multipart Form Upload
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 3. Convert the uploaded file into a format Spring's RestTemplate can transmit
        ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        // 4. Map the payload fields exactly matching what app.py expects ('file' and
        // 'interest')
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileAsResource);
        body.add("interest", interest);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // 5. Fire the request directly over the internet to the Python web service
        ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl, requestEntity, String.class);

        return response.getBody();
    }
}