import { ref, update, remove } from "firebase/database";
import { database, auth } from "../config/firebase";

interface TaskActionsProps {
  taskId: string;
  status: "pending" | "completed";
  onTaskUpdated: () => void;
}

const TaskActions = ({ taskId, status, onTaskUpdated }: TaskActionsProps) => {
  const handleComplete = async () => {
    if (!auth.currentUser) return;

    try {
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
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) return;

    try {
      const taskRef = ref(
        database,
        `users/${auth.currentUser.uid}/tasks/${taskId}`
      );
      await remove(taskRef);
      onTaskUpdated();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleComplete}
        className={`px-3 py-1 rounded-md text-sm ${
          status === "completed"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-green-100 text-green-800 hover:bg-green-200"
        }`}
      >
        {status === "completed" ? "⏳ Pending" : "✅ Complete"}
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-800 hover:bg-red-200"
      >
        🗑️ Delete
      </button>
    </div>
  );
};

export default TaskActions;
