from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Создать тестовых пользователей для разработки'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Количество тестовых пользователей для создания (default: 5)',
        )

    def handle(self, *args, **options):
        count = options['count']
        
        # Основной тестовый пользователь
        test_user_phone = '999999999'
        test_user_password = 'test1234'
        
        # Проверяем, существует ли пользователь
        if User.objects.filter(phone=test_user_phone).exists():
            self.stdout.write(
                self.style.WARNING(f'Пользователь с телефоном {test_user_phone} уже существует')
            )
        else:
            user = User.objects.create_user(
                phone=test_user_phone,
                password=test_user_password,
                first_name='Test',
                last_name='User',
                email='test@example.com'
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Создан тестовый пользователь:'
                    f'\n   Телефон: {test_user_phone}'
                    f'\n   Пароль: {test_user_password}'
                    f'\n   Имя: {user.first_name} {user.last_name}'
                )
            )
        
        # Создаем дополнительных пользователей
        created_count = 0
        for i in range(1, count + 1):
            phone = f'79{i:09d}'  # Генерируем телефон: 79000000001, 79000000002, etc.
            
            if User.objects.filter(phone=phone).exists():
                continue
            
            user = User.objects.create_user(
                phone=phone,
                password='test1234',
                first_name=f'User{i}',
                email=f'user{i}@example.com'
            )
            created_count += 1
        
        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'\n✅ Создано {created_count} дополнительных пользователей')
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Всего пользователей в базе: {User.objects.count()}'
            )
        )
