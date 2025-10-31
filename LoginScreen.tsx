import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EMPLOYEE_NAME } from '../constants';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Đăng nhập</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sử dụng tên của bạn để tiếp tục
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Tên nhân viên
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </button>
          </div>
           <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Nhập tên bất kỳ để đăng nhập.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
