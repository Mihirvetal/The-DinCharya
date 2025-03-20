import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, onValue, off } from "firebase/database";
import { database } from "../config/firebase";
import TaskForm from "../components/TaskForm";
import TaskActions from "../components/TaskActions";
import Logo from "../assets/react.svg";
import styles from "../styles/Dashboard.module.css";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarInner}>
            <div className={styles.logoContainer}>
              <div className={styles.logoWrapper}>
                <div className={styles.logoImage}>
                  <img src={Logo} alt="Dincharya" />
                </div>
                <span className={styles.logoText}>DinCharya</span>
              </div>
            </div>
            <div className={styles.navButtons}>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className={styles.addTaskButton}
              >
                <span className={styles.buttonIcon}>
                  {showAddTask ? "✕" : "➕"}
                </span>
                {showAddTask ? "Cancel" : "Add Task"}
              </button>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <span className={styles.buttonIcon}>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.categoryBar}>
        <div className={styles.categoryContent}>
          <div className={styles.categoryButtons}>
            {(["personal", "business", "future"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.active : ""
                }`}
              >
                <span>
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

      <main className={styles.mainContent}>
        <div>
          {showAddTask && (
            <TaskForm
              onTaskAdded={() => setShowAddTask(false)}
              category={selectedCategory}
            />
          )}

          <div className={styles.taskContainer}>
            <div className={styles.taskHeader}>
              <h2 className={styles.taskTitle}>
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}{" "}
                Tasks
              </h2>
            </div>

            <div className={styles.taskList}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyStateIcon}>📝</span>
                  <h3 className={styles.emptyStateTitle}>No tasks found</h3>
                  <p className={styles.emptyStateDescription}>
                    Get started by creating a new task
                  </p>
                </div>
              ) : (
                <div className={styles.taskGrid}>
                  {filteredTasks.map((task) => (
                    <div key={task.id} className={styles.taskCard}>
                      <div className={styles.taskHeader}>
                        <div className={styles.taskContent}>
                          <div className={styles.taskTitleRow}>
                            <h3 className={styles.taskTitle}>{task.title}</h3>
                            <span
                              className={`${styles.statusBadge} ${
                                task.status === "completed"
                                  ? styles.completed
                                  : styles.pending
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className={styles.taskDescription}>
                            {task.description}
                          </p>
                          <div className={styles.taskDueDate}>
                            <span className="mr-1">📅</span>
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        <div className={styles.taskActions}>
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
