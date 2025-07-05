import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../services/auth";
import { apiService } from "../services/api";
import type { Task } from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    loadTasks();
  }, [isAuthenticated, navigate]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    try {
      const newTask = await apiService.createTask({ title, description });
      setTasks((prev) => {
        const updatedTasks = [newTask, ...prev];
        // Keep only the most recent 5 tasks
        return updatedTasks.slice(0, 5);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleDone = async (id: number) => {
    try {
      await apiService.markTaskAsDone(id);

      // Remove the completed task immediately
      setTasks((prev) => prev.filter((task) => task.id !== id));

      // Only fetch new tasks if we might need replacements
      // Do this in a non-blocking way to avoid multiple loading states
      apiService
        .getTasks()
        .then((freshTasks) => {
          setTasks(freshTasks);
        })
        .catch((fetchError) => {
          // Silent error for background refresh
        });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark task as done"
      );
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 min-h-screen via-white to-purple-50/50">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl shadow-gray-900/5 mb-6">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600 mt-1">
              Let's get things done efficiently
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl max-w-2xl mx-auto shadow-lg">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Form Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Add New Task
              </h3>
            </div>
            <TaskForm onAddTask={handleAddTask} />
          </div>
        </div>

        {/* Task Cards Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Your Tasks
            </h3>
          </div>
          {isLoading ? (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <svg
                  className="animate-spin w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Loading your tasks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-16 from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-700 mb-2">
                    No tasks yet!
                  </h4>
                  <p className="text-gray-500">
                    Create your first task using the form to get started.
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDone={() => handleDone(task.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
