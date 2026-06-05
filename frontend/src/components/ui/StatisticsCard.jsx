import React from 'react';

export default function StatisticsCard({ title, value, icon: Icon, colorClass = "text-blue-600 bg-blue-100" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}