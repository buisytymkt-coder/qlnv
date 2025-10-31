import React, { useState, useEffect } from 'react';
import { Task, DayOfWeek } from '../types';
import { CloseIcon } from './icons';

interface TaskFormModalProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  taskToEdit?: Task | null;
}

const weekDays = [
  { label: 'CN', value: DayOfWeek.Sunday },
  { label: 'T2', value: DayOfWeek.Monday },
  { label: 'T3', value: DayOfWeek.Tuesday },
  { label: 'T4', value: DayOfWeek.Wednesday },
  { label: 'T5', value: DayOfWeek.Thursday },
  { label: 'T6', value: DayOfWeek.Friday },
  { label: 'T7', value: DayOfWeek.Saturday },
];

const TaskFormModal: React.FC<TaskFormModalProps> = ({ onClose, onSave, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [kpi, setKpi] = useState('');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setKpi(taskToEdit.kpi);
      if (taskToEdit.schedule === 'daily') {
        setScheduleType('daily');
        setSelectedDays([]);
      } else {
        setScheduleType('weekly');
        setSelectedDays(taskToEdit.schedule);
      }
    }
  }, [taskToEdit]);

  const handleDayClick = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên công việc.');
      return;
    }
    
    // FIX: Explicitly type `taskData` to ensure `schedule` has the correct literal type ('daily') instead of being inferred as a general string.
    const taskData: Omit<Task, 'id'> = {
      title,
      kpi,
      schedule: scheduleType === 'daily' ? 'daily' : selectedDays,
    };
    
    if (taskToEdit) {
      onSave({ ...taskData, id: taskToEdit.id });
    } else {
      onSave(taskData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {taskToEdit ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
              </h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <CloseIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên công việc
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="kpi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  KPI/Chỉ tiêu
                </label>
                <input
                  type="text"
                  id="kpi"
                  value={kpi}
                  onChange={e => setKpi(e.target.value)}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lịch trình
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="daily"
                      type="radio"
                      name="scheduleType"
                      value="daily"
                      checked={scheduleType === 'daily'}
                      onChange={() => setScheduleType('daily')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="daily" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                      Hàng ngày
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="weekly"
                      type="radio"
                      name="scheduleType"
                      value="weekly"
                      checked={scheduleType === 'weekly'}
                      onChange={() => setScheduleType('weekly')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="weekly" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                      Hàng tuần
                    </label>
                  </div>
                </div>
              </div>
              {scheduleType === 'weekly' && (
                <div className="flex justify-center space-x-1 pt-2">
                  {weekDays.map(day => (
                    <button
                      type="button"
                      key={day.value}
                      onClick={() => handleDayClick(day.value)}
                      className={`h-10 w-10 rounded-full font-semibold transition-colors ${
                        selectedDays.includes(day.value)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
