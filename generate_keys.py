#!/usr/bin/env python3
"""
Скрипт для генерации ключей безопасности MarketAI
"""

from django.core.management.utils import get_random_secret_key
from cryptography.fernet import Fernet
import secrets


def generate_all_keys():
    """Генерирует все необходимые ключи безопасности"""

    print("=" * 70)
    print("🔐 ГЕНЕРАЦИЯ КЛЮЧЕЙ БЕЗОПАСНОСТИ MarketAI")
    print("=" * 70)
    print()

    # Django Secret Key
    django_key = get_random_secret_key()
    print("1️⃣  Django Secret Key (для settings.py):")
    print(f"DJANGO_SECRET_KEY={django_key}")
    print()

    # Field Encryption Key
    fernet_key = Fernet.generate_key().decode()
    print("2️⃣  Field Encryption Key (для шифрования в БД):")
    print(f"FIELD_ENCRYPTION_KEY={fernet_key}")
    print()

    # JWT Secret Key
    jwt_key = secrets.token_urlsafe(64)
    print("3️⃣  JWT Secret Key (для токенов аутентификации):")
    print(f"JWT_SECRET_KEY={jwt_key}")
    print()

    print("=" * 70)
    print("✅ ГОТОВО! Скопируйте ключи выше в файл .env")
    print("=" * 70)
    print()
    print("⚠️  ВАЖНО:")
    print("   - Никогда не коммитьте .env файл в Git!")
    print("   - Храните ключи в безопасности!")
    print("   - Для production используйте другие ключи!")
    print()


if __name__ == "__main__":
    generate_all_keys()
