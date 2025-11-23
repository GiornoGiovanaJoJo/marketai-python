# 🚀 Первоначальная настройка после клонирования

Этот файл содержит важные шаги, которые нужно выполнить **ОДИН РАЗ** после клонирования репозитория.

---

## ✅ **Шаг 1: Установить зависимости Frontend**

После обновления `package.json` необходимо установить новые зависимости:

### **Linux/macOS:**

```bash
cd frontend
npm install
cd ..
```

### **Windows (PowerShell/CMD):**

```powershell
cd frontend
npm install
cd ..
```

### **Что будет установлено:**

- ✅ `@reduxjs/toolkit@^2.2.0` - Redux Toolkit (новый)
- ✅ `axios@^1.7.0` - HTTP клиент (обновленный)
- ✅ Все остальные зависимости

---

## ✅ **Шаг 2: Создать .env файл**

Скопируйте пример конфигурации:

### **Linux/macOS:**

```bash
cp .env.example .env
```

### **Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

### **Windows (CMD):**

```cmd
copy .env.example .env
```

### **Важно:**

Файл `.env.example` уже содержит все необходимые настройки для **локальной разработки**.

Для **production** необходимо изменить:
- `DJANGO_SECRET_KEY` - генерируйте новый
- `JWT_SECRET_KEY` - генерируйте новый
- `FIELD_ENCRYPTION_KEY` - генерируйте новый
- `DB_PASSWORD` - измените на безопасный
- `WILDBERRIES_API_KEY` - ваш реальный API ключ

---

## ✅ **Шаг 3: Запустить Docker**

Теперь можно запустить проект:

### **Linux/macOS:**

```bash
chmod +x docker-local.sh
./docker-local.sh start
```

### **Windows (PowerShell):**

```powershell
.\docker-local.ps1 start
```

---

## 🔍 **Проверка успешного запуска**

После запуска (2-3 минуты) откройте в браузере:

1. ✅ **Frontend:** http://localhost:3000
2. ✅ **Backend API:** http://localhost:8000/api
3. ✅ **Admin панель:** http://localhost:8000/admin
   - **Login:** `admin`
   - **Password:** `admin`
4. ✅ **Swagger документация:** http://localhost:8000/api/docs

---

## 🐛 **Решение проблем**

### **Проблема 1: Порты уже заняты**

```bash
# Проверьте, какие порты заняты
# Linux/macOS
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :5432
sudo lsof -i :6379

# Windows (PowerShell от администратора)
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

**Решение:** Остановите процессы или измените порты в `docker-compose.yml`

---

### **Проблема 2: `npm install` зависает**

```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules
rm -rf frontend/node_modules  # Linux/macOS
Remove-Item -Recurse frontend/node_modules  # Windows PowerShell

# Повторите установку
cd frontend
npm install
```

---

### **Проблема 3: Docker не запускается**

```bash
# Полная очистка
./docker-local.sh clean  # Linux/macOS
.\docker-local.ps1 clean  # Windows

# Перезапустите
./docker-local.sh start  # Linux/macOS
.\docker-local.ps1 start  # Windows
```

---

### **Проблема 4: Frontend не загружается**

```bash
# Проверьте логи frontend
docker-compose logs frontend

# Перезапустите frontend
./docker-local.sh restart-one frontend  # Linux/macOS
.\docker-local.ps1 restart-one frontend  # Windows
```

---

## 📚 **Дополнительные ресурсы**

- 🚀 [QUICK_START.md](./QUICK_START.md) - Быстрый старт
- 🐳 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Полное руководство по Docker
- 🧪 [TESTING.md](./TESTING.md) - Руководство по тестированию
- 🛠️ [CONTRIBUTING.md](./CONTRIBUTING.md) - Руководство по разработке

---

## ✅ **Чеклист первоначальной настройки**

- [ ] Клонировал репозиторий
- [ ] Выполнил `cd frontend && npm install`
- [ ] Скопировал `.env.example` в `.env`
- [ ] Запустил `./docker-local.sh start` (или `.ps1` для Windows)
- [ ] Проверил работу frontend на http://localhost:3000
- [ ] Проверил работу backend на http://localhost:8000/api
- [ ] Зашёл в admin панель (admin/admin)
- [ ] Просмотрел Swagger документацию

---

🎉 **Поздравляем! Проект готов к работе!**

По вопросам создавайте [issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues) на GitHub.
