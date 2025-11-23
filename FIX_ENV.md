# ⚡ Быстрое исправление .env

## 🐞 Проблема:

```
django.core.exceptions.ImproperlyConfigured: FIELD_ENCRYPTION_KEY defined incorrectly
```

## ✅ Решение (1 минута):

### Windows:

```powershell
# 1. Остановите Docker
docker-compose down

# 2. Обновите .env из GitHub
git pull origin main
rm .env
copy .env.example .env

# 3. Запустите снова
docker-compose up -d

# 4. Проверьте
docker-compose ps
```

### Linux/macOS:

```bash
# 1. Остановите Docker
docker-compose down

# 2. Обновите .env из GitHub
git pull origin main
rm .env
cp .env.example .env

# 3. Запустите снова
./docker-local.sh start
```

---

## 🔧 Ручное исправление (если не хотите git pull):

### Шаг 1: Откройте .env

```powershell
notepad .env
```

### Шаг 2: Найдите строку

Найдите:
```
FIELD_ENCRYPTION_KEY=your-encryption-key-here-generate-with-fernet
```

### Шаг 3: Замените на

```
FIELD_ENCRYPTION_KEY=6LJ8jK9wYx5vN2pQmR4tU7vA3bC5dE8fG1hI2jK4lM=
```

### Шаг 4: Сохраните

- `Ctrl+S` для сохранения
- Закройте блокнот

### Шаг 5: Перезапустите

```powershell
docker-compose down
docker-compose up -d
```

---

## 📝 Что это за ключ?

`FIELD_ENCRYPTION_KEY` - это **Fernet ключ** для шифрования API ключей в базе данных.

**Требования:**
- Длина: 44 символа
- Формат: Base64 URL-safe
- Окончание: `=`

**Ключ в .env.example был невалидный!** Я уже исправил его на GitHub.

---

## 🔐 Генерация собственного ключа (опционально):

### Python:

```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

### PowerShell:

```powershell
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### Docker (если Python не установлен локально):

```powershell
docker run --rm python:3.12-slim python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

## ❗ Важно:

- 🟢 **Для тестирования:** используйте ключ из обновлённого `.env.example`
- 🔴 **Для production:** ГЕНЕРИРУЙТЕ СВОЙ КЛЮЧ!

---

**После исправления backend заработает! 🎉**
