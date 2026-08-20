import { CloudSun } from 'lucide-react';

export const WeatherBadge = ({ weather }) => {
  if (!weather) return null;
  return (
    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-medium border border-blue-100">
      <CloudSun className="w-3.5 h-3.5 text-blue-500" />
      <span>{weather.temp}°C, {weather.description}</span>
    </div>
  );
};