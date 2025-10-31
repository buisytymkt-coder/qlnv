import React, { useState } from 'react';
import { Task } from '../types';
import TaskFormModal from './TaskFormModal';
import { CloseIcon, PlusIcon, PencilIcon, TrashIcon } from './icons';

interface ManageTasksModalProps {
  onClose: () => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const ManageTasksModal: React.FC<ManageTasksModalProps> = ({
  onClose,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleAddTaskClick = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
      onUpdateTask(taskData as Task);
    } else {
      onAddTask(taskData);
    }
    setIsFormOpen(false);
    setTaskToEdit(null);
  };
  
  const handleDelete = (taskId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
      onDeleteTask(taskId);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
          <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý Công việc</h2>
            <div className="flex items-center gap-4">
              <button onClick={handleAddTaskClick} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon className="h-5 w-5"/>
                <span>Thêm mới</span>
              </button>
              <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </header>

          <main className="overflow-y-auto p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.length > 0 ? tasks.map(task => (
                <li key={task.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-md font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.kpi}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditTaskClick(task)} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                      <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                      <TrashIcon className="h-5 w-5"/>
                    </button>
                  </div>
                </li>
              )) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Chưa có công việc nào. Hãy thêm công việc mới.</p>
              )}
            </ul>
          </main>
        </div>
      </div>
      {isFormOpen && (
        <TaskFormModal
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      )}
    </>
  );
};

export default ManageTasksModal;
