import React, { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string, description: string) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.description.trim()) {
      setIsSubmitting(true);
      try {
        await onAddTask(newTask.title.trim(), newTask.description.trim());
        setNewTask({ title: "", description: "" });
      } catch (error) {
        // Error handling is done in the parent component
        console.error("Failed to add task:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Create New Task
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={100}
          />
        </div>
        <div>
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-vertical"
            required
            maxLength={500}
          />
        </div>
        <button
          type="submit"
          disabled={
            isSubmitting || !newTask.title.trim() || !newTask.description.trim()
          }
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-3 rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? "Creating Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
