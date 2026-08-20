import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const token = localStorage.getItem('token');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/tasks?search=${search}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, token]);

  useEffect(() => {
    if (token) {
      const abortController = new AbortController();
      
      const loadTasks = async () => {
        setLoading(true);
        try {
          let url = `http://localhost:5000/api/tasks?search=${search}`;
          if (statusFilter) url += `&status=${statusFilter}`;
          if (priorityFilter) url += `&priority=${priorityFilter}`;

          const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal,
          });
          setTasks(res.data.data || []);
        } catch (err) {
          if (err.name !== 'CanceledError') {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
          }
        } finally {
          setLoading(false);
        }
      };
      
      loadTasks();
      
      return () => abortController.abort();
    }
  }, [search, statusFilter, priorityFilter, token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('location', location);
    if (dueDate) formData.append('dueDate', dueDate);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setLocation('');
      setDueDate('');
      setFile(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch {
      setError('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="auth-badge" style={{ width: '36px', height: '36px', fontSize: '14px', margin: 0 }}>TF</div>
          <span className="brand-title">TaskFlow Dashboard</span>
        </div>
        <div className="nav-user">
          <span className="user-text">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Sign Out</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Task Creation Sidebar / Card */}
        <div className="task-create-section">
          <div className="auth-card" style={{ maxWidth: '100%' }}>
            <h2 className="section-title">Create New Task</h2>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleCreateTask} className="auth-form">
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finish Project Report"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Task details..."
                  className="form-input"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location (City)</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attachment (Cloudinary)</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn-primary">Add Task</button>
            </form>
          </div>
        </div>

        {/* Task List and Filters */}
        <div className="task-list-section">
          {/* Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="🔍 Search tasks by title/desc..."
              className="form-input search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-input filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select
              className="form-input filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Cards Display */}
          {loading ? (
            <p className="status-text">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="no-tasks-card">
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div key={task._id} className={`task-card status-${task.status.toLowerCase()}`}>
                  <div className="task-card-header">
                    <span className={`badge-priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <select
                      className="status-dropdown"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <h3 className="task-card-title">{task.title}</h3>
                  <p className="task-card-desc">{task.description || 'No description provided.'}</p>

                  {/* Weather Info */}
                  {task.weather && (
                    <div className="task-weather-tag">
                      <span>🌤 {task.weather.cityName}: {task.weather.temp}°C, {task.weather.description}</span>
                    </div>
                  )}

                  {/* Attachment */}
                  {task.fileUrl && (
                    <div className="task-file-link">
                      <a href={task.fileUrl} target="_blank" rel="noreferrer">
                        📎 View Uploaded File
                      </a>
                    </div>
                  )}

                  <div className="task-card-footer">
                    <span className="task-due-date">
                      {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;