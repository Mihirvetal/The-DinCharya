import { useState } from "react";
import { ref, update, remove } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

interface TaskActionsProps {
  taskId: string;
  status: "pending" | "completed";
}

const TaskActions = ({ taskId, status }: TaskActionsProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStatusChange = async (newStatus: "pending" | "completed") => {
    if (!user) return;

    try {
      setLoading(true);
      const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`);
      await update(taskRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`);
      await remove(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2 mt-4">
      <button
        onClick={() =>
          handleStatusChange(status === "completed" ? "pending" : "completed")
        }
        disabled={loading}
        className={`px-3 py-1 text-sm rounded-md ${
          status === "completed"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-green-100 text-green-800 hover:bg-green-200"
        } disabled:opacity-50`}
      >
        {status === "completed" ? "⏳ Mark Pending" : "✅ Mark Complete"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
      >
        🗑️ Delete
      </button>
    </div>
  );
};

export default TaskActions;
