import os
import time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse
from app.auth.jwt import get_current_user
from app.services.pdf_service import extract_text_from_pdf_bytes

router = APIRouter(prefix="/resume", tags=["Resume"])

# Absolute path to uploads directory at backend/uploads
UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    "uploads"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate extension
    filename = file.filename
    if not filename or not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are allowed."
        )

    try:
        # Read the file contents in-memory
        content_bytes = await file.read()
        
        # Extract text from the PDF bytes
        extracted_text = extract_text_from_pdf_bytes(content_bytes)
        
        # Create a unique filename to avoid overwrites
        unique_filename = f"user_{current_user.id}_{int(time.time())}_{filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(content_bytes)
            
        # Create Resume database record
        new_resume = Resume(
            user_id=current_user.id,
            file_name=filename,
            extracted_text=extracted_text
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)
        
        return {
            "success": True,
            "message": "Resume uploaded and text extracted successfully.",
            "data": new_resume
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while uploading: {str(e)}"
        )
