# AI Resume Analyzer Backend API

This is the FastAPI backend API for the AI Resume Analyzer SaaS application. It provides secure JWT-based user authentication, PDF resume upload and text extraction, AI-powered resume analysis against job descriptions, analysis histories, and user dashboard statistics.

## Project Structure

```text
backend/
│
├── app/
│   ├── main.py                  # API entry point & exception handlers
│   ├── database.py              # SQLite & SQLAlchemy engine configuration
│   ├── config.py                # Environment configurations (Pydantic settings)
│   │
│   ├── models/                  # SQLAlchemy ORM Models
│   │   ├── user.py
│   │   ├── resume.py
│   │   └── analysis.py
│   │
│   ├── schemas/                 # Pydantic schemas (validations & API payloads)
│   │   ├── user.py
│   │   ├── resume.py
│   │   └── analysis.py
│   │
│   ├── routes/                  # API endpoint handlers
│   │   ├── auth.py
│   │   ├── resume.py
│   │   ├── analysis.py
│   │   └── dashboard.py
│   │
│   ├── services/                # Business logic services
│   │   ├── ai_service.py        # OpenAI analysis integration
│   │   └── pdf_service.py       # PDF text extraction (PyMuPDF)
│   │
│   ├── auth/
│   │   └── jwt.py               # Token management and password hashing (bcrypt)
│   │
│   └── prompts/
│       └── resume_prompt.py     # Prompt templates for OpenAI critique
│
├── uploads/                     # Temp physical storage of uploaded PDFs
├── requirements.txt             # Python dependencies
├── .env                         # Custom environment secrets
├── .env.example                 # Mock environment template
└── README.md                    # Installation and API documentation
```

## Quick Start Setup

### 1. Prerequisites
- Python 3.8 or higher.
- A virtual environment tool (`venv` or `conda`).

### 2. Installation Steps
Clone or open the project folder in your terminal, navigate to the `backend/` directory, and run the following commands:

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment (Windows Powershell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install the dependencies
pip install -r requirements.txt
```

### 3. Environment Configurations
Configure your environment variables by checking the `.env` file in the `backend/` directory:

```ini
DATABASE_URL=sqlite:///./resume_analyzer.db
JWT_SECRET=supersecretjwtkeychangeitinproduction
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OPENAI_API_KEY=your-openai-api-key-here
```
> **Note**: An OpenAI API key is required to use the resume critique features. Without it, the `/analysis/create` route will raise a warning error response requesting you to configure the key.

### 4. Running the Dev Server
Launch the development server using `uvicorn`:

```bash
uvicorn app.main:app --reload
```
Once started, the server will run on `http://127.0.0.1:8000`.

---

## API Documentation

FastAPI automatically generates interactive Swagger documentation:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Authentication Endpoints

#### Register User
* **Endpoint**: `POST /auth/register`
* **Request Body**:
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2026-07-18T11:15:00"
  }
}
```

#### Login User
* **Endpoint**: `POST /auth/login`
* **Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

#### Get Current User details (Protected)
* **Endpoint**: `GET /auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully.",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2026-07-18T11:15:00"
  }
}
```

---

### Resume Upload Endpoints (Protected)

#### Upload PDF Resume
* **Endpoint**: `POST /resume/upload`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**: Form Data (`file`: File Object)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resume uploaded and text extracted successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "file_name": "john_resume.pdf",
    "extracted_text": "Extracted text content from resume...",
    "uploaded_at": "2026-07-18T11:20:00"
  }
}
```

---

### AI Analysis Endpoints (Protected)

#### Create Analysis Report
* **Endpoint**: `POST /analysis/create`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
```json
{
  "resume_id": 1,
  "job_description": "We are seeking a FastAPI developer with experience in SQL..."
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resume analysis completed successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "resume_id": 1,
    "job_description": "We are seeking a FastAPI developer with experience in SQL...",
    "ats_score": 85,
    "ai_response_json": {
      "ats_score": 85,
      "matching_skills": ["Python", "FastAPI"],
      "missing_skills": ["Docker", "Kubernetes"],
      "strengths": ["Strong backend development experience", "Proficient in SQL database design"],
      "weaknesses": ["Lack of cloud deployment experience", "Minimal frontend framework knowledge"],
      "improvement_suggestions": ["Add cloud certification", "Include dockerization steps in project section"],
      "interview_questions": ["Explain how you handled concurrency in FastAPI?", "Describe a complex SQL optimization you performed."]
    },
    "created_at": "2026-07-18T11:25:00"
  }
}
```

#### Fetch Analysis History
* **Endpoint**: `GET /analysis/history`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**: Returns list of analyses (latest first).
```json
{
  "success": true,
  "message": "Analysis history retrieved successfully.",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "resume_id": 1,
      "job_description": "...",
      "ats_score": 85,
      "ai_response_json": { ... },
      "created_at": "2026-07-18T11:25:00"
    }
  ]
}
```

#### Fetch Analysis Details
* **Endpoint**: `GET /analysis/{analysis_id}`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Analysis details retrieved successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "resume_id": 1,
    "job_description": "...",
    "ats_score": 85,
    "ai_response_json": { ... },
    "created_at": "2026-07-18T11:25:00"
  }
}
```

---

### Dashboard Endpoints (Protected)

#### Fetch Dashboard Stats
* **Endpoint**: `GET /dashboard`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully.",
  "data": {
    "total_resumes": 1,
    "total_analyses": 1,
    "average_score": 85.0,
    "recent_analyses": [
      {
        "id": 1,
        "user_id": 1,
        "resume_id": 1,
        "job_description": "...",
        "ats_score": 85,
        "ai_response_json": { ... },
        "created_at": "2026-07-18T11:25:00"
      }
    ]
  }
}
```
