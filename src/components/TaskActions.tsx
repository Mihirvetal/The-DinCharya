import { ref, update, remove } from "firebase/database";
import { database, auth } from "../config/firebase";
import styles from "../styles/TaskActions.module.css";
import { useState } from "react";

interface TaskActionsProps {
  taskId: string;
  status: "pending" | "completed";
  onTaskUpdated: () => void;
}

const TaskActions = ({ taskId, status, onTaskUpdated }: TaskActionsProps) => {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const taskRef = ref(
        database,
        `users/${auth.currentUser.uid}/tasks/${taskId}`
      );
      await update(taskRef, {
        status: status === "completed" ? "pending" : "completed",
        updatedAt: new Date().toISOString(),
      });
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const taskRef = ref(
        database,
        `users/${auth.currentUser.uid}/tasks/${taskId}`
      );
      await remove(taskRef);
      onTaskUpdated();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.actionsContainer}>
      <button
        onClick={handleComplete}
        disabled={loading}
        className={`${styles.actionButton} ${
          status === "completed" ? styles.pendingButton : styles.completeButton
        } ${loading ? styles.loading : ""}`}
      >
        <span className={styles.icon}>
          {status === "completed" ? "⏳" : "✅"}
        </span>
        <span>{status === "completed" ? "Pending" : "Complete"}</span>
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`${styles.actionButton} ${styles.deleteButton} ${
          loading ? styles.loading : ""
        }`}
      >
        <span className={styles.icon}>🗑️</span>
        <span>Delete</span>
      </button>
    </div>
  );
};

export default TaskActions;
