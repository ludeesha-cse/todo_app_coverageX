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
    <div className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                {task.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {task.description}
              </p>
            </div>
          </div>
          {task.created_at && (
            <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Created {formatDate(task.created_at)}
            </div>
          )}
        </div>
        <button
          onClick={onDone}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="hidden sm:inline">Complete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
