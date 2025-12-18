from rest_framework import permissions


class IsAdminOrOwner(permissions.BasePermission):
    """Allow access if user is in Admin group or is the object owner.

    - Authenticated users are allowed to access the views in general (`has_permission`).
    - For object-level permission, Admin users (or superusers) are granted full access.
      Other users are allowed only if they own the object.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser:
            return True
        # Check Admin group membership
        if user.groups.filter(name='Admin').exists():
            return True
        # Otherwise only owners
        return getattr(obj, 'owner', None) == user
