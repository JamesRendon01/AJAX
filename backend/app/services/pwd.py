from passlib.context import CryptContext

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return _pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    if not hashed:
        return False
    try:
        return _pwd_ctx.verify(plain, hashed)
    except Exception:
        return plain == hashed

def is_hash_recognized(hashed: str) -> bool:
    try:
        _pwd_ctx.identify(hashed)
        return True
    except Exception:
        return False
