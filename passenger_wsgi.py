import sys
import os

# Path to your Django project directory
project_home = '/home/scoresco/720U2'

# Path to the virtual environment
virtualenv_home = '/home/scoresco/virtualenv/720U2/3.12'

# Activate the virtual environment
activate_this = os.path.join(virtualenv_home, 'bin', 'activate_this.py')
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

# Add the project directory to the Python path
sys.path.insert(0, project_home)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ['DJANGO_SETTINGS_MODULE'] = 'scores.settings'

# Import and set up the WSGI application
from scores.wsgi import application