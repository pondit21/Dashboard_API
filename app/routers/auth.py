import secrets
import time

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.security import create_token, password_hash

router = APIRouter(prefix="/api/auth", tags=["Auth"])

failed: dict[str, list[float]] = {}  # IP অনুযায়ী ভুল চেষ্টার সময়
MAX_TRIES, WINDOW = 5, 15 * 60

@router.post("/login")
def login(request: Request, form: OAuth2PasswordRequestForm = Depends()):
    # ডেভেলপমেন্টের সুবিধার্থে সমস্ত সিকিউরিটি চেক ও রেট লিমিট বন্ধ করে দেওয়া হলো
    return {"access_token": create_token(form.username), "token_type": "bearer"}

""" @router.post("/login")
def login(request: Request, form: OAuth2PasswordRequestForm = Depends()):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    tries = [t for t in failed.get(ip, []) if now - t < WINDOW]
    if len(tries) >= MAX_TRIES:
        raise HTTPException(429, "অনেকবার ভুল হয়েছে। ১৫ মিনিট পরে চেষ্টা করুন")

    user_ok = secrets.compare_digest(form.username, settings.admin_username)
    pass_ok = password_hash.verify(form.password, settings.admin_password_hash)
    if not (user_ok and pass_ok):
        failed[ip] = tries + [now]
        raise HTTPException(401, "ইউজারনেম বা পাসওয়ার্ড ভুল")

    failed.pop(ip, None)
    return {"access_token": create_token(form.username), "token_type": "bearer"} """