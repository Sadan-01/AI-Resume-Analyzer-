import fitz  # PyMuPDF

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extracts plain text from raw PDF bytes.
    
    Raises:
        ValueError: If PDF parsing fails or results in empty text.
    """
    text = ""
    try:
        # Open PDF from in-memory bytes stream
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text_page = page.get_text()
                if text_page:
                    text += text_page + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF content: {str(e)}")
    
    cleaned_text = text.strip()
    if not cleaned_text:
        raise ValueError("The uploaded PDF does not contain extractable or readable text.")
    
    return cleaned_text
