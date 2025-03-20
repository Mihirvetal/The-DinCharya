import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { database } from "../config/firebase";
import TaskActions from "../components/TaskActions";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: "pending" | "completed";
  createdAt: string;
}

interface TaskData {
  [key: string]: Omit<Task, "id">;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const tasksRef = ref(database, `users/${user.uid}/tasks`);

    const handleData = (snapshot: DataSnapshot) => {
      const data = snapshot.val() as TaskData | null;
      if (data) {
        const tasksArray = Object.entries(data).map(([id, task]) => ({
          id,
          ...task,
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
      setLoading(false);
    };

    onValue(tasksRef, handleData);

    return () => {
      off(tasksRef);
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">DinCharya</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <button
              onClick={() => navigate("/add-task")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No tasks yet. Add your first task!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{task.category}</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <TaskActions taskId={task.id} status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
