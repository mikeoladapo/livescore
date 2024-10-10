from django.template import engines
from django.shortcuts import render as rnd

def render(request, template_name, context=None):
    """
    Custom render function to dynamically set template directories based on
    the request (mobile or desktop).
    """
    if context is None:
        context = {}

    # Access the Django template engine
    django_engine = engines['django']
    
    # Set the template directories dynamically
    django_engine.dirs = request.template_dirs
    print(django_engine.dirs)
    # Render the template using the dynamically set directories
    return rnd(request, template_name, context)
