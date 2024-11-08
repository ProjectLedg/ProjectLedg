import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>
      
      <div className="space-y-4 w-full max-w-md">
        <Link to="/admin/users" className="w-full text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white">
          Manage Users
        </Link>
      </div>
    </div>
  );
}
