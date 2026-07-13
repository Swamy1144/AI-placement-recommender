from fastapi import FastAPI
import spacy

app = FastAPI()
nlp = spacy.load("en_core_web_sm")

@app.get("/")
def home():
    return {"status": "AI Engine Online"}

@app.post("/extract")
def extract_skills(data: dict):
    text = data.get("text", "")
    doc = nlp(text)
    # Filter for tech-related entities
    skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]]
    return {"extracted_skills": list(set(skills))}