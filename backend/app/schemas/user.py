import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

# Base API Response Wrappers
class ApiSuccessResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"

# User Schemas
class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100, description="Full name of the user")
    email: str = Field(..., description="Email address of the user")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        # Basic email format check
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v):
            raise ValueError("Invalid email address format")
        return v

class UserLogin(BaseModel):
    email: str = Field(..., description="Email address")
    password: str = Field(..., description="Password")

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Wrapped Responses (as requested: {success: True, message: "...", data: {...}})
class UserResponse(ApiSuccessResponse):
    data: UserOut

class TokenResponse(ApiSuccessResponse):
    data: Token
