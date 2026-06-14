import sqlalchemy.types as types
from app.services.crypto import encrypt, decrypt
from app.services.pwd import hash_password

class EncryptedString(types.TypeDecorator):
    impl = types.String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return encrypt(str(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return decrypt(value)

class PasswordField(types.TypeDecorator):
    impl = types.String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return hash_password(value)

    def process_result_value(self, value, dialect):
        return value
