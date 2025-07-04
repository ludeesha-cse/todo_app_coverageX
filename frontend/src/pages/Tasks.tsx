import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buy books', description: 'Buy books for the next school year' },
    { id: 2, title: 'Clean home', description: 'Need to clean the bed room' },
    { id: 3, title: 'Takehome assignment', description: 'Finish the mid-term assignment' },
    { id: 4, title: 'Play Cricket', description: 'Plan the soft ball cricket match on next Sunday' },
    { id: 5, title: 'Help Saman', description: 'Saman need help with his software project' },
  ]);

  const handleAddTask = (title: string, description: string) => {
    setTasks([...tasks, { id: Date.now(), title, description }]);
  };

  const handleDone = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Tasks</h2>
      <TaskForm onAddTask={handleAddTask} />
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDone={() => handleDone(task.id)} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;