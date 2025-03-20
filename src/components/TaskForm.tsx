import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database, auth } from "../config/firebase";
import styles from "../styles/TaskForm.module.css";

interface TaskFormProps {
  onTaskAdded: () => void;
  category: "personal" | "business" | "future";
}

const TaskForm = ({ onTaskAdded, category }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("You must be logged in to add tasks");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const tasksRef = ref(database, `users/${auth.currentUser.uid}/tasks`);
      const newTaskRef = push(tasksRef);

      await set(newTaskRef, {
        title,
        description,
        category,
        dueDate,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: newTaskRef.key,
      });

      // Clear form
      setTitle("");
      setDescription("");
      setDueDate("");

      // Notify parent component
      onTaskAdded();
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add New Task</h3>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${styles.input} ${loading ? styles.loading : ''}`}
            required
            disabled={loading}
            placeholder="Enter task title"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.textarea} ${loading ? styles.loading : ''}`}
            rows={3}
            disabled={loading}
            placeholder="Enter task description"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="dueDate" className={styles.label}>
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`${styles.input} ${loading ? styles.loading : ''}`}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;