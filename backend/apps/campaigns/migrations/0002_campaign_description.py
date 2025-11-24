# Generated migration for adding description field to Campaign

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='description',
            field=models.TextField(blank=True, help_text='Campaign description (optional)', null=True, verbose_name='description'),
        ),
    ]