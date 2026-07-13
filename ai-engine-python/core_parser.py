import spacy

# Load the NLP model (Make sure to run: python -m spacy download en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

def extract_professional_entities(text):
    doc = nlp(text)
    # Extracting Companies/Tech (ORG) and Locations (GPE)
    found_entities = [(ent.text, ent.label_) for ent in doc.ents]
    return found_entities

# Example usage for testing
if __name__ == "__main__":
    sample_resume = "Experienced Java Developer at Oracle based in Hyderabad."
    print("Extracted Info:", extract_professional_entities(sample_resume))