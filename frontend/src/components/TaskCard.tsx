import React from "react";
import type { Task } from "../services/api";

interface TaskCardProps {
  task: Task;
  onDone: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDone }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {task.title}
          </h3>
          <p className="text-gray-600 mb-3">{task.description}</p>
          {task.created_at && (
            <p className="text-sm text-gray-400">
              Created: {formatDate(task.created_at)}
            </p>
          )}
        </div>
        <button
          onClick={onDone}
          className="ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Mark Done
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
