from flask import Blueprint, request, redirect, url_for, render_template
from flask_login import login_required, current_user
from src.models import db, Task

task_bp = Blueprint('task', __name__)

@task_bp.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    if request.method == 'POST':
        title = request.form['title']
        if title:
            new_task = Task(title=title, user=current_user)
            db.session.add(new_task)
            db.session.commit()
        return redirect(url_for('task.dashboard'))

    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', tasks=tasks)

@task_bp.route('/task/<int:task_id>/toggle')
@login_required
def toggle_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return "Non autorisé", 403
    task.done = not task.done
    db.session.commit()
    return redirect(url_for('task.dashboard'))

@task_bp.route('/task/<int:task_id>/delete')
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return "Non autorisé", 403
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('task.dashboard'))
