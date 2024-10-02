# web/middleware/device_detection.py
from django.shortcuts import redirect


class MobileRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        is_mobile = any(device in user_agent for device in ['iphone', 'android', 'mobile', 'ipad', 'tablet'])

        if is_mobile and not request.path.startswith('/m/'):
            return redirect('/m/')
        elif not is_mobile and request.path.startswith('/m/'):
            return redirect('/')

        return None
