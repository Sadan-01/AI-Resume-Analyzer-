from datetime import datetime
from pydantic import BaseModel
from app.schemas.user import ApiSuccessResponse

class ResumeOut(BaseModel):
    id: int
    user_id: int
    file_name: str
    extracted_text: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ResumeResponse(ApiSuccessResponse):
    data: ResumeOut
