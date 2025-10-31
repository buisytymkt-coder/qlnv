import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  status: TaskStatus;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, status, onStatusChange }) => {
  const isAchieved = status === TaskStatus.Achieved;
  const isFailed = status === TaskStatus.Failed;

  return (
    <li className={`p-4 transition-colors duration-300 ${isAchieved ? 'bg-green-50 dark:bg-green-900/20' : isFailed ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <p className={`font-medium text-gray-900 dark:text-gray-100 ${isAchieved || isFailed ? 'opacity-70' : ''}`}>
            {task.title}
          </p>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isAchieved || isFailed ? 'opacity-70' : ''}`}>
            {task.kpi}
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onStatusChange(task.id, isAchieved ? TaskStatus.Pending : TaskStatus.Achieved)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isAchieved
                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-green-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-green-500'
            }`}
            aria-pressed={isAchieved}
          >
            Đạt
          </button>
          <button
            onClick={() => onStatusChange(task.id, isFailed ? TaskStatus.Pending : TaskStatus.Failed)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isFailed
                ? 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-red-500'
            }`}
            aria-pressed={isFailed}
          >
            Không đạt
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;