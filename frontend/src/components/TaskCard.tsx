import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  onDone: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDone }) => {
  return (
    <div className="bg-gray-200 p-4 rounded flex justify-between">
      <div>
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <button onClick={onDone} className="bg-green-500 text-white p-2 rounded">
        Done
      </button>
    </div>
  );
};

export default TaskCard;