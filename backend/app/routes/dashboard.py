from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.analysis import DashboardResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Count total resumes
    total_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).count()

    # Count total analyses
    total_analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).count()

    # Calculate average score (SQLAlchemy returns float or None)
    avg_score_query = db.query(func.avg(Analysis.ats_score)).filter(
        Analysis.user_id == current_user.id
    ).scalar()
    
    average_score = round(float(avg_score_query), 2) if avg_score_query is not None else 0.0

    # Fetch 5 most recent analyses
    recent_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).limit(5).all()

    return {
        "success": True,
        "message": "Dashboard statistics retrieved successfully.",
        "data": {
            "total_resumes": total_resumes,
            "total_analyses": total_analyses,
            "average_score": average_score,
            "recent_analyses": recent_analyses
        }
    }
