import React, { useMemo, useState } from 'react';
import { ChecklistData, Task, TaskStatus } from '../types';
import { CloseIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface MonthlyReportProps {
  onClose: () => void;
  checklistData: ChecklistData;
  tasks: Task[];
  isTaskScheduled: (task: Task, date: Date) => boolean;
  initialDate: Date;
  employeeName: string;
}

const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ onClose, checklistData, tasks, isTaskScheduled, initialDate, employeeName }) => {
  
  const getMonthRange = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { firstDay, lastDay };
  };

  const initialRange = getMonthRange(initialDate);

  const [startDate, setStartDate] = useState<Date>(initialRange.firstDay);
  const [endDate, setEndDate] = useState<Date>(initialRange.lastDay);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        // Parse date string as local time to avoid timezone issues
        const [year, month, day] = e.target.value.split('-').map(Number);
        setter(new Date(year, month - 1, day));
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
  };

  const displayDateRange = startDate && endDate ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` : 'Vui lòng chọn khoảng thời gian';


  const summaryData = useMemo(() => {
    let achieved = 0;
    let failed = 0;
    if (!startDate || !endDate) return { achieved, failed };

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = formatDateForInput(currentDate);
      const dayData = checklistData[dateKey];
      if (dayData) {
        // Only count tasks that were scheduled for that day
        tasks.forEach(task => {
            if(isTaskScheduled(task, currentDate) && dayData[task.id]){
                 if (dayData[task.id].status === TaskStatus.Achieved) {
                    achieved++;
                } else if (dayData[task.id].status === TaskStatus.Failed) {
                    failed++;
                }
            }
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return { achieved, failed };
  }, [checklistData, startDate, endDate, tasks, isTaskScheduled]);

  const reportData = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    return tasks.map(task => {
      let scheduledDays = 0;
      let completedDays = 0;
      
      let currentDate = new Date(startDate);
      while(currentDate <= endDate) {
        if (isTaskScheduled(task, currentDate)) {
          scheduledDays++;
          const dateKey = formatDateForInput(currentDate);
          if (checklistData[dateKey]?.[task.id]?.status === TaskStatus.Achieved) {
            completedDays++;
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const completionRate = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 100;

      return {
        ...task,
        scheduledDays,
        completedDays,
        completionRate,
      };
    });
  }, [startDate, endDate, tasks, checklistData, isTaskScheduled]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform animate-scale-in">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Báo cáo hiệu suất - {displayDateRange}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nhân viên: {employeeName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto">
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Từ ngày</label>
                  <input 
                    type="date" 
                    id="start-date" 
                    value={formatDateForInput(startDate)} 
                    onChange={handleDateChange(setStartDate)}
                    className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div className="w-full sm:w-auto">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đến ngày</label>
                  <input 
                    type="date" 
                    id="end-date" 
                    value={formatDateForInput(endDate)} 
                    onChange={handleDateChange(setEndDate)}
                    className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
          </div>
        </header>
        
        <main className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4"/>
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200">Tổng số mục tiêu Đạt</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summaryData.achieved}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-500 mr-4"/>
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200">Tổng số mục tiêu Không Đạt (vi phạm)</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{summaryData.failed}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Công việc</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày yêu cầu</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày hoàn thành (Đạt)</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tỷ lệ hoàn thành</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.map(item => {
                    const rateColor = item.completionRate >= 90 ? 'text-green-600 dark:text-green-400' : item.completionRate >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
                    return(
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-normal">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.kpi}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-300">{item.scheduledDays}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-300">{item.completedDays}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${rateColor}`}>{item.completionRate}%</td>
                        </tr>
                    )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <style>{`
          @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          @keyframes scale-in {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MonthlyReport;
