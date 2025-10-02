import React, { useEffect } from 'react';
import api from '../services/api';

export default function TodoList({ todos, setTodos }) {
  // Fetch user's tasks when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get('/todos');
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching todos:', err);
      }
    };

    fetchTodos();
  }, [setTodos]);

  // Toggle completed status
  const toggleComplete = async (todo) => {
    try {
      const updated = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => (t._id === todo._id ? updated.data : t)));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  if (!todos || todos.length === 0) return <p>No tasks yet. Add some!</p>;

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo._id} className="todo-item">
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
            onClick={() => toggleComplete(todo)}
          >
            {todo.title}
          </span>
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
