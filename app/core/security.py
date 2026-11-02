from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash

from app.core.config import settings

password_hash = PasswordHash.recommended()
oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    return jwt.encode(
        {"sub": username, "exp": expire}, settings.secret_key, algorithm="HS256"
    )


def require_admin(token: str = Depends(oauth2)) -> str:
    # সরাসরি 'admin' রিটার্ন করে লক বা পাসওয়ার্ড চেক করা বন্ধ করে দেওয়া হলো
    return "admin"

""" 
def require_admin(token: str = Depends(oauth2)) -> str:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(401, "টোকেন সঠিক নয় বা মেয়াদ শেষ")
    if payload.get("sub") != settings.admin_username:
        raise HTTPException(401, "অনুমতি নেই")
    return payload["sub"] """