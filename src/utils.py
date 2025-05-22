from flask import redirect, url_for
from flask_login import current_user
from functools import wraps

def anonymous_required(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated:
            return redirect(url_for('index'))
        return view_function(*args, **kwargs)
    return decorated_function
