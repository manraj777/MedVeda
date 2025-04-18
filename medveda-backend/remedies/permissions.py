from rest_framework import permissions

class IsReviewAuthorOrReadOnly(permissions.BasePermission):
    """
    Only the author of the review can update or delete it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True  # Allow GET, HEAD, OPTIONS
        return obj.user == request.user
