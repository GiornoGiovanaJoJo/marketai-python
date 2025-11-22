.PHONY: help install migrate test lint format shell createsuperuser

help:
	@echo "Available commands:"
	@echo "  install        - Install dependencies"
	@echo "  migrate        - Run database migrations"
	@echo "  test           - Run tests"
	@echo "  lint           - Run code linters"
	@echo "  format         - Format code"
	@echo "  shell          - Open Django shell"
	@echo "  createsuperuser - Create superuser"
	@echo "  testdata       - Create test data"
	@echo "  runserver      - Run development server"

install:
	pip install -r requirements.txt

migrate:
	python manage.py makemigrations
	python manage.py migrate

test:
	pytest

lint:
	flake8 apps
	isort --check-only apps
	black --check apps

format:
	isort apps
	black apps

shell:
	python manage.py shell

createsuperuser:
	python manage.py createsuperuser

testdata:
	python manage.py create_test_data

runserver:
	python manage.py runserver 0.0.0.0:8000
