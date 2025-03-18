import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, onValue, off } from "firebase/database";
import { database } from "../config/firebase";
import TaskForm from "../components/TaskForm";
import TaskActions from "../components/TaskActions";
import Logo from "../assets/react.svg";

interface Task {
  id: string;
  title: string;
  description: string;
  category: "personal" | "business" | "future";
  dueDate: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "personal" | "business" | "future"
  >("personal");
  const [showAddTask, setShowAddTask] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const tasksRef = ref(database, `users/${user.uid}/tasks`);

    // Listen for changes in tasks
    const unsubscribe = onValue(
      tasksRef,
      (snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          // Convert object to array and sort by createdAt
          const tasksArray = Object.entries(tasksData)
            .map(([id, task]: [string, any]) => ({
              id,
              ...task,
            }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      off(tasksRef);
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <img src={Logo} alt="Dincharya" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  DinCharya
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center"
              >
                <span className="mr-2">+</span>
                {showAddTask ? "Cancel" : "Add Task"}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center"
              >
                <span className="mr-2">→</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(["personal", "business", "future"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } flex items-center space-x-2`}
              >
                <span className="mr-2">
                  {category === "personal" && "👤"}
                  {category === "business" && "💼"}
                  {category === "future" && "🎯"}
                </span>
                <span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showAddTask && (
            <TaskForm
              onTaskAdded={() => setShowAddTask(false)}
              category={selectedCategory}
            />
          )}

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}{" "}
                Tasks
              </h2>
            </div>

            <div className="p-6">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">📝</span>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No tasks found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new task
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {task.title}
                            </h3>
                            <span
                              className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className="text-gray-600">{task.description}</p>
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span className="mr-1">📅</span>
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <TaskActions
                            taskId={task.id}
                            status={task.status}
                            onTaskUpdated={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
