from fastapi import FastAPI, UploadFile, File, Form
import spacy

app = FastAPI()

# Load the NLP model
nlp = spacy.load("en_core_web_sm")

@app.get("/")
def home():
    return {"status": "AI Engine Online"}

# Route 1: Handles the text-based extraction from ApiController.java
@app.post("/extract")
def extract_skills(data: dict):
    text = data.get("text", "")
    doc = nlp(text)
    skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]]
    return {"extracted_skills": list(set(skills))}

# Route 2: Handles the file upload tracking from AIService.java
@app.post("/process-resume")
async def process_resume(file: UploadFile = File(...), interest: str = Form(...)):
    # Read the text contents of the uploaded file
    contents = await file.read()
    text = contents.decode("utf-8", errors="ignore")
    
    doc = nlp(text)
    # Extract structural components matching ORG (Companies/Tech) or PRODUCT
    skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]]
    
    return {
        "interest": interest,
        "extracted_skills": list(set(skills)),
        "status": "Processed Successfully"
    }