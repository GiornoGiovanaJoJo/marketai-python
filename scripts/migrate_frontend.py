#!/usr/bin/env python3
"""
Скрипт для автоматической миграции frontend из marketai-front в marketai-python/frontend

Usage:
    python scripts/migrate_frontend.py

Предварительно:
    1. Клонируйте оба репозитория рядом:
       git clone https://github.com/GiornoGiovanaJoJo/marketai-front.git
       git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git

    2. Перейдите в marketai-python:
       cd marketai-python

    3. Создайте и переключитесь на ветку:
       git checkout -b feature/full-frontend-migration

    4. Запустите скрипт:
       python scripts/migrate_frontend.py
"""

import os
import shutil
from pathlib import Path
import sys

# Пути к репозиториям
SOURCE_REPO = Path("../marketai-front")
TARGET_FRONTEND = Path("frontend")

# Директории и файлы для переноса
FILES_TO_MIGRATE = [
    # Корневые файлы
    "src/App.tsx",
    "src/main.tsx",
    "src/index.css",
    "src/vite-env.d.ts",
]

DIRS_TO_MIGRATE = [
    # Директории для полного переноса
    "src/components",
    "src/contexts",
    "src/hooks",
    "src/lib",
    "src/pages",
    "src/services",
    "src/store",
    "src/types",
]

def check_source_repo():
    """Проверка наличия исходного репозитория"""
    if not SOURCE_REPO.exists():
        print(f"❌ Ошибка: Исходный репозиторий не найден по пути {SOURCE_REPO.absolute()}")
        print("\nВыполните:")
        print("  cd ..")
        print("  git clone https://github.com/GiornoGiovanaJoJo/marketai-front.git")
        print("  cd marketai-python")
        sys.exit(1)
    print(f"✅ Исходный репозиторий найден: {SOURCE_REPO.absolute()}")

def check_target_frontend():
    """Проверка наличия целевой директории frontend"""
    if not TARGET_FRONTEND.exists():
        print(f"❌ Ошибка: Целевая директория {TARGET_FRONTEND} не найдена")
        sys.exit(1)
    print(f"✅ Целевая директория найдена: {TARGET_FRONTEND.absolute()}")

def backup_existing_files():
    """Создание резервной копии существующих файлов"""
    backup_dir = Path("frontend_backup")
    if backup_dir.exists():
        print("⚠️  Резервная копия уже существует, пропускаю...")
        return

    print("📦 Создание резервной копии существующих файлов...")
    shutil.copytree(TARGET_FRONTEND, backup_dir)
    print(f"✅ Резервная копия создана: {backup_dir.absolute()}")

def migrate_file(source_path: Path, target_path: Path):
    """Перенос отдельного файла"""
    try:
        # Создаем директорию если не существует
        target_path.parent.mkdir(parents=True, exist_ok=True)

        # Копируем файл
        shutil.copy2(source_path, target_path)
        print(f"  ✅ {source_path.relative_to(SOURCE_REPO)} → {target_path.relative_to(TARGET_FRONTEND.parent)}")
        return True
    except Exception as e:
        print(f"  ❌ Ошибка при копировании {source_path}: {e}")
        return False

def migrate_directory(source_dir: Path, target_dir: Path):
    """Перенос всей директории"""
    try:
        if target_dir.exists():
            print(f"  🗑️  Удаление существующей директории: {target_dir.relative_to(TARGET_FRONTEND.parent)}")
            shutil.rmtree(target_dir)

        # Копируем всю директорию
        shutil.copytree(source_dir, target_dir)
        print(f"  ✅ {source_dir.relative_to(SOURCE_REPO)} → {target_dir.relative_to(TARGET_FRONTEND.parent)}")

        # Подсчет файлов
        file_count = sum(1 for _ in target_dir.rglob('*') if _.is_file())
        print(f"     📄 Скопировано файлов: {file_count}")
        return True
    except Exception as e:
        print(f"  ❌ Ошибка при копировании директории {source_dir}: {e}")
        return False

def update_package_json():
    """Обновление package.json с недостающими зависимостями"""
    print("\n📦 Проверка package.json...")
    source_package = SOURCE_REPO / "package.json"
    target_package = TARGET_FRONTEND / "package.json"

    try:
        import json

        with open(source_package, 'r', encoding='utf-8') as f:
            source_data = json.load(f)

        with open(target_package, 'r', encoding='utf-8') as f:
            target_data = json.load(f)

        # Проверяем недостающие зависимости
        missing_deps = set(source_data.get('dependencies', {}).keys()) - \
                      set(target_data.get('dependencies', {}).keys())

        if missing_deps:
            print(f"  ⚠️  Найдено недостающих зависимостей: {len(missing_deps)}")
            print("     Запустите: npm install")
            for dep in sorted(missing_deps):
                version = source_data['dependencies'][dep]
                print(f"       - {dep}@{version}")
        else:
            print("  ✅ Все зависимости установлены")

    except Exception as e:
        print(f"  ❌ Ошибка при проверке package.json: {e}")

def main():
    print("\n" + "="*70)
    print("🚀 МИГРАЦИЯ FRONTEND: marketai-front → marketai-python/frontend")
    print("="*70 + "\n")

    # Проверки
    check_source_repo()
    check_target_frontend()

    # Создание резервной копии
    backup_existing_files()

    # Счетчики
    total_files = 0
    total_dirs = 0
    success_files = 0
    success_dirs = 0

    # Миграция отдельных файлов
    print("\n📄 Миграция корневых файлов...")
    for file_path in FILES_TO_MIGRATE:
        source = SOURCE_REPO / file_path
        target = TARGET_FRONTEND / file_path

        if source.exists():
            total_files += 1
            if migrate_file(source, target):
                success_files += 1
        else:
            print(f"  ⚠️  Файл не найден: {file_path}")

    # Миграция директорий
    print("\n📁 Миграция директорий...")
    for dir_path in DIRS_TO_MIGRATE:
        source = SOURCE_REPO / dir_path
        target = TARGET_FRONTEND / dir_path

        if source.exists():
            total_dirs += 1
            if migrate_directory(source, target):
                success_dirs += 1
        else:
            print(f"  ⚠️  Директория не найдена: {dir_path}")

    # Обновление package.json
    update_package_json()

    # Итоги
    print("\n" + "="*70)
    print("📊 ИТОГИ МИГРАЦИИ")
    print("="*70)
    print(f"\nФайлы:       {success_files}/{total_files} успешно")
    print(f"Директории:  {success_dirs}/{total_dirs} успешно")

    if success_files == total_files and success_dirs == total_dirs:
        print("\n✅ Миграция завершена успешно!")
        print("\n📝 Следующие шаги:")
        print("   1. Проверьте изменения: git status")
        print("   2. Установите зависимости: cd frontend && npm install")
        print("   3. Запустите dev сервер: npm run dev")
        print("   4. Проверьте работоспособность приложения")
        print("   5. Закоммитьте изменения: git add . && git commit -m 'feat: Полная миграция frontend'")
        print("   6. Запушьте в ветку: git push origin feature/full-frontend-migration")
        print("   7. Создайте Pull Request на GitHub")
    else:
        print("\n⚠️  Миграция завершена с ошибками")
        print("    Проверьте логи выше для деталей")

    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    main()
