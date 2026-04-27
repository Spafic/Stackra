from pydantic import BaseModel, EmailStr, ConfigDict

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)