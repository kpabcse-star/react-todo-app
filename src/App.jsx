import React, { useState, useEffect } from 'react';
import './index.css';

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: taskInput.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingTaskId === id) {
      setEditingTaskId(null);
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );
    setEditingTaskId(null);
  };

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>Task Manager</h1>
        <p>Keep your day organized</p>
      </header>

      <form onSubmit={handleAddTask} className="todo-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          maxLength={100}
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks remaining! Enjoy your day.</div>
      ) : (
        <ul className="todo-list">
          {tasks.map((task) => (
            <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
              <div className="todo-item-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="todo-checkbox"
                />
                
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="task-text">{task.text}</span>
                )}
              </div>

              <div className="todo-item-actions">
                {editingTaskId === task.id ? (
                  <button onClick={() => handleSaveEdit(task.id)} className="save-btn">
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => startEditing(task.id, task.text)} 
                    className="edit-btn"
                    disabled={task.completed}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
