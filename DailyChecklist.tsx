import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';

interface DailyChecklistProps {
  tasks: Task[];
  checklistData: { [taskId: string]: { status: TaskStatus } };
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const DailyChecklist: React.FC<DailyChecklistProps> = ({ tasks, checklistData, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="font-semibold">Không có công việc nào được lên lịch cho ngày này.</p>
        <p className="text-sm mt-1">Hãy chọn một ngày khác để xem công việc.</p>
      </div>
    );
  }
  
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          status={checklistData[task.id]?.status || TaskStatus.Pending}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
};

export default DailyChecklist;