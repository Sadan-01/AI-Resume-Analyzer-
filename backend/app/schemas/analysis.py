from datetime import datetime
from typing import List
from pydantic import BaseModel, Field
from app.schemas.user import ApiSuccessResponse

class AiResponseDetails(BaseModel):
    ats_score: int = Field(..., description="ATS score out of 100")
    matching_skills: List[str] = Field(default_factory=list, description="List of matching skills")
    missing_skills: List[str] = Field(default_factory=list, description="List of missing skills")
    strengths: List[str] = Field(default_factory=list, description="Candidate strengths")
    weaknesses: List[str] = Field(default_factory=list, description="Candidate weaknesses")
    improvement_suggestions: List[str] = Field(default_factory=list, description="Suggestions for improvement")
    interview_questions: List[str] = Field(default_factory=list, description="Suggested interview questions")

class AnalysisCreate(BaseModel):
    resume_id: int
    job_description: str = Field(..., min_length=10, description="Job description text")

class AnalysisOut(BaseModel):
    id: int
    user_id: int
    resume_id: int
    job_description: str
    ats_score: int
    ai_response_json: AiResponseDetails
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisResponse(ApiSuccessResponse):
    data: AnalysisOut

class AnalysisHistoryResponse(ApiSuccessResponse):
    data: List[AnalysisOut]

# Dashboard Schemas
class DashboardData(BaseModel):
    total_resumes: int = Field(..., description="Total resumes uploaded by the user")
    total_analyses: int = Field(..., description="Total analyses run by the user")
    average_score: float = Field(..., description="Average ATS score across all analyses")
    recent_analyses: List[AnalysisOut] = Field(..., description="The user's 5 most recent analyses")

class DashboardResponse(ApiSuccessResponse):
    data: DashboardData
