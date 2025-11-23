"""Organizations app signals."""
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Organization, Employee


User = get_user_model()


@receiver(post_save, sender=Organization)
def organization_post_save(sender, instance, created, **kwargs):
    """Handle organization creation."""
    if created:
        # Create owner as employee if not exists
        Employee.objects.get_or_create(
            organization=instance,
            user=instance.owner,
            defaults={
                'role': Employee.Role.OWNER,
                'status': Employee.Status.ACTIVE,
                'position': 'Owner'
            }
        )


@receiver(pre_delete, sender=Employee)
def employee_pre_delete(sender, instance, **kwargs):
    """Handle employee deletion - clean up permissions."""
    # Delete associated permissions
    instance.permissions.all().delete()
