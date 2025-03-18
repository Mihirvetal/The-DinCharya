import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database, auth } from "../config/firebase";

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
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Task</h3>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={loading}
            placeholder="Enter task description"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
