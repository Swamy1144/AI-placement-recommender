import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class ApiController {

    @PostMapping("/process-resume")
    public String process(@RequestBody String resumeText) {
        // UPDATED: Pointing to your live Render cloud endpoint for text extraction
        String pythonUrl = "https://ai-placement-recommender.onrender.com/extract";
        RestTemplate restTemplate = new RestTemplate();

        // Sending data to Python over the internet
        return restTemplate.postForObject(pythonUrl, resumeText, String.class);
    }
}