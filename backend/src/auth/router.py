from fastapi import APIRouter, Depends, HTTPException, status
from auth.schemas import UserLogin, Token
from auth import service
from config.db import get_connection

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin):
    # 1. Fetch user (Passing ONLY the email string)
    user = service.get_user_by_email(user_credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 2. Extract password (handling MS SQL column case sensitivity)
    db_password = user.get('Password') or user.get('password')
    
    if not db_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database mapping error: Password field not found in result set."
        )

    # 3. Verify Password
    if not service.verify_password(user_credentials.password, db_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 4. Generate and return tokens
    user_email = user.get('Email') or user.get('email')
    access_token, refresh_token = service.create_tokens(user_email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
def refresh_token(token_input: str, db = Depends(get_connection)):
    from jose import JWTError
    from config.settings import get_settings
    settings = get_settings()

    try:
        # 1. Decode and validate the refresh token
        payload = service.jwt.decode(token_input, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    # 2. Ensure user still exists in database
    user = service.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # 3. Issue a new pair
    access, new_refresh = service.create_tokens(email)
    return {
        "access_token": access, 
        "refresh_token": new_refresh, 
        "token_type": "bearer"
    }