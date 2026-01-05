from pydantic import BaseModel, EmailStr
from typing import List, Optional

class WaitlistSubmission(BaseModel):
    clinicType: str
    otherClinicType: Optional[str] = ""
    clinicSize: str
    painPoints: List[str]
    currentSetup: str
    impactLevel: str
    willingnessToPay: str
    priceRange: Optional[str] = ""
    solutionWins: List[str]
    otherWish: Optional[str] = ""
    role: str
    fullName: str
    clinicName: str
    email: EmailStr
    phone: Optional[str] = ""

class WaitlistResponse(BaseModel):
    success: bool
    message: str
