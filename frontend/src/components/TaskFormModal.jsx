import { useState } from 'react';
import API from '../services/api';
import { X, Upload } from 'lucide-react';

export const TaskFormModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    location: '',
    dueDate: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });
      if (file) data.append('file', file);

      await API.post('/tasks', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onTaskCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">TITLE *</label>
            <input
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Prepare Presentation"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">DESCRIPTION</label>
            <textarea
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rows-3"
              placeholder="Provide more context..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">PRIORITY</label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">DUE DATE</label>
              <input
                type="date"
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">LOCATION (CITY)</label>
            <input
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., London, Hyderabad"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ATTACHMENT</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100">
              <Upload className="w-4 h-4 text-gray-500" />
              <input
                type="file"
                className="text-xs text-gray-600"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};