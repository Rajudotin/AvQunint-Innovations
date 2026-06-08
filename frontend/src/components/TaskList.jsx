import { useState } from "react";
import API from "../services/api";

function TaskList({ tasks, onEditTask, fetchTasks }) {
  const [busyId, setBusyId] = useState(null);

  const handleToggleStatus = async (task) => {
    setBusyId(task._id);
    try {
      const nextStatus = task.status === "Completed" ? "Pending" : "Completed";

      await API.put(`/tasks/${task._id}`, {
        status: nextStatus,
      });

      await fetchTasks();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update task");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (task) => {
    const ok = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (!ok) return;

    setBusyId(task._id);
    try {
      await API.delete(`/tasks/${task._id}`);
      await fetchTasks();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete task");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No Tasks Found</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {task.title}
                </h3>
                {task.description ? (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                ) : (
                  <p className="text-gray-400 mt-1">No description</p>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div
                  className={
                    "mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
                    (task.status === "Completed"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500 text-white")
                  }
                >
                  {task.status}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleToggleStatus(task)}
                disabled={busyId === task._id}
                className={
                  "px-3 py-1 rounded-lg text-white transition " +
                  (task.status === "Completed"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700")
                }
              >
                {busyId === task._id
                  ? "Updating..."
                  : task.status === "Completed"
                    ? "Mark Pending"
                    : "Mark Completed"}
              </button>

              <button
                type="button"
                onClick={() => onEditTask(task)}
                disabled={busyId === task._id}
                className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-90"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(task)}
                disabled={busyId === task._id}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-90"
              >
                {busyId === task._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
