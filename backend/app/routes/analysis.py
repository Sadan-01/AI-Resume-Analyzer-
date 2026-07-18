from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisHistoryResponse
from app.auth.jwt import get_current_user
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.post("/create", response_model=AnalysisResponse)
def create_analysis(
    analysis_in: AnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if the resume exists and belongs to current user
    resume = db.query(Resume).filter(
        Resume.id == analysis_in.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or you do not have permission to access it."
        )

    try:
        # Trigger OpenAI analysis service
        ai_response = analyze_resume_with_ai(
            resume_text=resume.extracted_text,
            job_description=analysis_in.job_description
        )

        # Save analysis report in the DB
        new_analysis = Analysis(
            user_id=current_user.id,
            resume_id=resume.id,
            job_description=analysis_in.job_description,
            ats_score=ai_response.get("ats_score", 0),
            ai_response_json=ai_response
        )
        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)

        return {
            "success": True,
            "message": "Resume analysis completed successfully.",
            "data": new_analysis
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(e)}"
        )

@router.get("/history", response_model=AnalysisHistoryResponse)
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all analyses of logged-in user, latest first
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()

    return {
        "success": True,
        "message": "Analysis history retrieved successfully.",
        "data": analyses
    }

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_detail(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch details for specific analysis with owner verification
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found or access denied."
        )

    return {
        "success": True,
        "message": "Analysis details retrieved successfully.",
        "data": analysis
    }
