# web/middleware/device_detection.py
from django.urls import reverse
import os, user_agents
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.conf import settings


class MobileRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        user_agent = user_agents.parse(user_agent_string)
        is_mobile = user_agent.is_mobile
        
        # Get the current path and the login URL
        login_url = reverse('login')  # Replace 'login' with your login view name if necessary

        # Skip redirect logic for the login page and other authenticated-related URLs
        if request.path == login_url or request.path.startswith('/admin/'):
            return None
        
        if is_mobile and '/m/' not in  request.path:
            return redirect('/m/')
        elif not is_mobile and '/m/' in request.path:
            return redirect(request.path[2:])

        return None


class DeviceTemplateMiddleware:
    """
    Middleware to switch between different template directories (mobile/desktop)
    based on the user's device (mobile or desktop).
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        user_agent = user_agents.parse(user_agent_string)
        is_mobile = user_agent.is_mobile
        # Get the base template directory path (e.g., 'templates/')
        base_template_dir = os.path.join(settings.BASE_DIR, 'templates')
        if is_mobile:
            # If mobile, set mobile-specific templates
            request.template_dirs = [os.path.join(base_template_dir, 'mobile')]
        else:
            request.template_dirs = base_template_dir
        # Proceed with the request
        response = self.get_response(request)
        return response