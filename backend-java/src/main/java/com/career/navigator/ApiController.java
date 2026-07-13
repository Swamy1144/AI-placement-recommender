import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class ApiController {

    @PostMapping("/process-resume")
    public String process(@RequestBody String resumeText) {
        // This is where Java talks to Python
        String pythonUrl = "http://127.0.0.1:8000/extract";
        RestTemplate restTemplate = new RestTemplate();

        // Sending data to Python
        return restTemplate.postForObject(pythonUrl, resumeText, String.class);
    }
}