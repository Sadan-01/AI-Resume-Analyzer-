import json
from openai import OpenAI
from app.config import settings
from app.prompts.resume_prompt import SYSTEM_PROMPT, get_user_prompt

def analyze_resume_with_ai(resume_text: str, job_description: str) -> dict:
    """Sends resume text and job description to OpenAI's GPT model.
    
    Returns:
        dict: A structured dictionary containing ATS score and critique fields.
    """
    api_key = settings.OPENAI_API_KEY.strip()
    if not api_key or api_key == "your-openai-api-key-here":
        raise ValueError(
            "OpenAI API Key is not configured. Please set a valid OPENAI_API_KEY in your backend/.env file."
        )

    # Initialize client with current API key
    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": get_user_prompt(resume_text, job_description)}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        # Ensure all required keys exist, providing fallback values if necessary
        required_keys = [
            "ats_score",
            "matching_skills",
            "missing_skills",
            "strengths",
            "weaknesses",
            "improvement_suggestions",
            "interview_questions"
        ]
        for key in required_keys:
            if key not in data:
                if key == "ats_score":
                    data[key] = 0
                else:
                    data[key] = []
                    
        return data

    except Exception as e:
        raise ValueError(f"Failed to analyze resume with OpenAI: {str(e)}")
