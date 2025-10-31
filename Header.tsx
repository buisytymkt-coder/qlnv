import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, FileTextIcon, SettingsIcon, LogOutIcon, ListIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onShowReport: () => void;
  onManageTasks: () => void;
  onShowAuditLog: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onPrevDay, onNextDay, onToday, onShowReport, onManageTasks, onShowAuditLog }) => {
  const { user, logout } = useAuth();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checklist Công việc Hàng ngày</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nhân viên: <span className="font-semibold">{user}</span></p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">{formatDate(currentDate)}</span>
            <div className="flex items-center space-x-2">
              <button onClick={onPrevDay} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <button onClick={onToday} className="px-4 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Hôm nay
              </button>
              <button onClick={onNextDay} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end gap-2">
             <button onClick={onShowReport} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Báo cáo">
              <FileTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
              <span className="hidden md:inline text-sm font-medium">Báo cáo</span>
            </button>
            <button onClick={onManageTasks} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Quản lý công việc">
              <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
              <span className="hidden md:inline text-sm font-medium">Công việc</span>
            </button>
            <button onClick={onShowAuditLog} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Nhật ký hoạt động">
              <ListIcon className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
              <span className="hidden md:inline text-sm font-medium">Nhật ký</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" title="Đăng xuất">
              <LogOutIcon className="h-5 w-5"/>
              <span className="hidden md:inline text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
