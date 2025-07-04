import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.description) {
      onAddTask(newTask.title, newTask.description);
      setNewTask({ title: '', description: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        type="text"
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;