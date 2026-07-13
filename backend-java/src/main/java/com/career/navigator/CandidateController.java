package com.career.navigator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
// Fixed: Explicitly allow the React port to prevent browser blocks
@CrossOrigin(origins = "http://localhost:3000") 
public class CandidateController {

    @Autowired
    private CandidateRepository repository;

    @Autowired
    private AIService aiService;

    @PostMapping("/register")
    public Candidate registerCandidate(@RequestBody Candidate candidate) {
        return repository.save(candidate);
    }

    /**
     * Updated to produce APPLICATION_JSON_VALUE. 
     * This ensures React/Axios sees it as a proper object.
     */
    @PostMapping(value = "/analyze-resume", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("interest") String interest) {
        try {
            // Check if file is empty before sending to Python
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"File is empty\"}");
            }

            String result = aiService.callPython(file, interest);
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Java File IO Error: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            // This is the error showing in your React alert
            System.err.println("AI Bridge Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"AI Engine Connection Failed. Ensure Python is running on Port 5000.\"}");
        }
    }

    @GetMapping("/all")
    public List<Candidate> getAllCandidates() {
        return repository.findAll();
    }
}