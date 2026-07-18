from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

# Import database configuration
from app.database import Base, engine

# Import routes
from app.routes import auth, resume, analysis, dashboard

# Automatically build SQLite tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend API for secure user registration, login, PDF resume text extraction, and job description AI analysis.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Enable CORS for javascript frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers to match requested format: {"success": False, "message": "..."}
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    error_details = []
    for error in exc.errors():
        # Get path of field that caused validation error
        loc = ".".join(str(x) for x in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        error_details.append(f"{loc}: {msg}")
    
    message = "Validation Error: " + ", ".join(error_details)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": message
        }
    )

@app.exception_handler(Exception)
async def custom_general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": f"Internal Server Error: {str(exc)}"
        }
    )

# Root check route
@app.get("/", tags=["General"])
def read_root():
    return {
        "success": True,
        "message": "AI Resume Analyzer Backend API is running. Access /docs for Swagger documentation."
    }

# Include routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(dashboard.router)
