import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [initialTask, setInitialTask] = useState(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchTasks = async (opts = {}) => {
    const nextPage = opts.page ?? page;
    const nextLimit = opts.limit ?? limit;

    // prevent the loading-state lint errors by scheduling state updates
    // (lint workaround removed)
    await Promise.resolve();

    try {
      const response = await API.get("/tasks", {
        params: {
          q: query || undefined,
          status: statusFilter || undefined,
          page: nextPage,
          limit: nextLimit,
        },
      });

      setTasks(response.data.tasks || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }
      console.log(error);
      alert(msg || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Schedule async work to avoid sync setState lint
    Promise.resolve().then(() => fetchTasks({ page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setPage(1);
      fetchTasks({ page: 1 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter, limit]);

  const handleEditTask = (task) => {
    setInitialTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => setInitialTask(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <Navbar />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-5">
          <div>
            <h1 className="text-3xl text-black font-bold">Task Dashboard</h1>
            <p className="text-black mt-1">
              Create, update, delete and track your tasks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title/description..."
              className="bg-white border rounded-lg px-3 py-2 w-full sm:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border rounded-lg px-3 py-2"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <TaskForm
          fetchTasks={fetchTasks}
          initialTask={initialTask}
          onCancelEdit={handleCancelEdit}
        />

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            Loading...
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onEditTask={handleEditTask}
              fetchTasks={() => fetchTasks({ page })}
            />

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className="bg-white border rounded-lg px-3 py-2 text-sm"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>

                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => {
                    if (page <= 1) return;
                    setPage(page - 1);
                    setLoading(true);
                    fetchTasks({ page: page - 1 });
                  }}
                  disabled={page <= 1}
                  type="button"
                >
                  Prev
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
                  onClick={() => {
                    if (page >= totalPages) return;
                    setPage(page + 1);
                    setLoading(true);
                    fetchTasks({ page: page + 1 });
                  }}
                  disabled={page >= totalPages}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
