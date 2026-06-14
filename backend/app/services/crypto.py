import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

_KEY = os.getenv("ENCRYPTION_KEY")

def _get_cipher():
    if not _KEY:
        return None
    return Fernet(_KEY.encode() if isinstance(_KEY, str) else _KEY)

def encrypt(plain_text: str) -> str:
    if not plain_text:
        return plain_text
    cipher = _get_cipher()
    if not cipher:
        return plain_text
    return cipher.encrypt(plain_text.encode()).decode()

def decrypt(cipher_text: str) -> str:
    if not cipher_text:
        return cipher_text
    cipher = _get_cipher()
    if not cipher:
        return cipher_text
    try:
        return cipher.decrypt(cipher_text.encode()).decode()
    except Exception:
        return cipher_text
