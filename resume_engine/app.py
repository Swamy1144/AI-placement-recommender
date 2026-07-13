from flask import Flask, request, jsonify
from flask_cors import CORS 
import PyPDF2
import docx2txt
import re
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# --- LOAD DATASET ---
try:
    with open('job_dataset.json', 'r', encoding='utf-8') as f:
        JOB_DATA = json.load(f)
    print(f"✅ AI Engine Ready: {len(JOB_DATA)} roles loaded.")
except Exception as e:
    print(f"❌ Dataset Error: {e}")
    JOB_DATA = []

# --- NEW: STATUS ROUTE (Fixes the 'Not Found' error) ---
@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "status": "Python Engine Online", 
        "dataset_size": len(JOB_DATA),
        "port": 5000
    })

def clean_text_for_matching(text):
    """
    AI Logic: Simplifies terms so 'Core Java' and 'Java' match.
    'HTML5' -> 'html', 'Core Java' -> 'java', '.NET Core' -> 'net'
    """
    text = text.lower()
    # 1. Remove version numbers (HTML5 -> HTML)
    text = re.sub(r'\d+', '', text)
    # 2. Remove 'filler' words that block matching
    fillers = ['core', 'basics', 'fundamentals', 'advanced', 'programming', 'training', 'knowledge']
    for word in fillers:
        text = text.replace(word, '')
    # 3. Remove special characters and extra spaces
    text = re.sub(r'[^a-z\s]', ' ', text)
    return " ".join(text.split())

def extract_text(file):
    try:
        name = file.filename.lower()
        if name.endswith('.pdf'):
            reader = PyPDF2.PdfReader(file)
            return " ".join([p.extract_text() for p in reader.pages if p.extract_text()])
        elif name.endswith('.docx'):
            return docx2txt.process(file)
    except Exception as e:
        print(f"❌ File reading error: {e}")
    return ""

@app.route('/process-resume', methods=['POST'])
def process():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        user_interest = request.form.get('interest', '').lower().strip()
        resume_raw = extract_text(file)
        resume_text = resume_raw.lower()

        # Create a simplified 'base' version of the resume for fuzzy matching
        simplified_resume = clean_text_for_matching(resume_text)

        matched_job = None
        required_skills = []

        # 1. SMART DATASET SEARCH
        for item in JOB_DATA:
            title = (item.get('Title') or item.get('job_title') or "").lower()
            if user_interest in title:
                matched_job = title.upper()
                skills_raw = item.get('Skills') or item.get('skills') or ""
                
                if isinstance(skills_raw, list):
                    required_skills = skills_raw
                else:
                    required_skills = [s.strip() for s in re.split(r'[,;\n\t]+', str(skills_raw)) if s.strip()]
                break

        if not required_skills:
            required_skills = [user_interest]
            matched_job = "CUSTOM ANALYSIS"

        # 2. AI MATCHING LOGIC (Checks roots and exact names)
        found_skills = []
        for skill in required_skills:
            simple_skill = clean_text_for_matching(skill)
            
            # Match if simplified skill (e.g. 'java') is in simplified resume
            if len(simple_skill) > 1 and simple_skill in simplified_resume:
                found_skills.append(skill)
            # OR Match if original skill string is in original text
            elif skill.lower() in resume_text:
                found_skills.append(skill)
        
        missing_skills = [s for s in required_skills if s not in found_skills]

        # 3. ML COSINE SIMILARITY
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf = vectorizer.fit_transform([" ".join(required_skills), resume_text])
            ml_score = int(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0] * 100)
        except Exception as e:
            print(f"ML Score Error: {e}")
            ml_score = 0

        # Weighted Score Calculation
        skill_score = (len(found_skills) / len(required_skills)) * 100 if required_skills else 0
        final_score = int((skill_score * 0.7) + (ml_score * 0.3))

        # Layout Bonus for key sections
        for section in ['experience', 'projects', 'education', 'internship', 'certifications']:
            if section in resume_text: final_score += 2

        return jsonify({
            "ats_score": min(final_score, 100),
            "skills_found": found_skills,
            "missing_skills": missing_skills,
            "job_profile_matched": matched_job,
            "message": f"AI matched your resume against the {matched_job} industry standards."
        })

    except Exception as e:
        print(f"🔥 Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)