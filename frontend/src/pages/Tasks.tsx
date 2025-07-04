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
          console.error("Failed to fetch updated tasks:", fetchError);
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
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Manage your tasks efficiently</p>
        <p className="text-sm text-gray-500 mt-1">
          Showing your 5 most recent tasks
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <TaskForm onAddTask={handleAddTask} />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet. Create your first task above!</p>
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
  );
};

export default Tasks;
