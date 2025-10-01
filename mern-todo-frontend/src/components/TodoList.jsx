import React from 'react';
import api from '../services/api';

export default function TodoList({ todos, setTodos }) {
  const toggleComplete = async (todo) => {
    try {
      const updated = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => (t._id === todo._id ? updated.data : t)));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo._id}>
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