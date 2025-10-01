import React, { useState } from 'react';
import api from '../services/api';

export default function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const response = await api.post('/todos', { title });
      onAdd(response.data); // update frontend state
      setTitle('');
    } catch (err) {
      console.error('Error adding todo:', err);
      alert('Error adding todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter task..."
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
