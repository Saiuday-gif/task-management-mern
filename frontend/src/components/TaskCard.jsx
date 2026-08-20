import { MapPin, Paperclip, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { WeatherBadge } from './WeatherBadge';

export const TaskCard = ({ task, weather, onStatusUpdate, onDelete }) => {
  const isDone = task.status === 'DONE';

  const priorityStyles = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HIGH: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className={`font-semibold text-gray-800 text-lg leading-tight ${isDone ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium tracking-wide ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {task.dueDate && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.location && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{task.location}</span>
            </div>
          )}

          {weather && <WeatherBadge weather={weather} />}

          {task.fileUrl && (
            <a
              href={task.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-600 hover:underline px-2 py-1 bg-indigo-50 rounded border border-indigo-100 font-medium"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attachment</span>
            </a>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => onStatusUpdate(task._id, isDone ? 'PENDING' : 'DONE')}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              isDone
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-green-600' : 'text-gray-400'}`} />
            <span>{isDone ? 'Completed' : 'Mark as Done'}</span>
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};