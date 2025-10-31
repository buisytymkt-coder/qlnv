import React, { useState, useMemo, useCallback } from 'react';
import { Task, TaskStatus, ChecklistData, DayOfWeek, AuditLogEntry } from './types';
import { INITIAL_TASKS, EMPLOYEE_NAME, INITIAL_AUDIT_LOGS } from './constants';
import Header from './components/Header';
import DailyChecklist from './components/DailyChecklist';
import MonthlyReport from './components/MonthlyReport';
import ManageTasksModal from './components/ManageTasksModal';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import AuditLogModal from './components/AuditLogModal';

// Helper to format date consistently for keys
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [checklistData, setChecklistData] = useState<ChecklistData>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState<'report' | 'manageTasks' | 'auditLog' | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      user: user || 'System',
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [user]);

  const isTaskScheduled = useCallback((task: Task, date: Date): boolean => {
    if (task.schedule === 'daily') {
      return true;
    }
    const dayOfWeek = date.getDay() as DayOfWeek;
    return task.schedule.includes(dayOfWeek);
  }, []);

  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter(task => isTaskScheduled(task, currentDate));
  }, [tasks, currentDate, isTaskScheduled]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const dateKey = formatDateKey(currentDate);
    const taskTitle = tasks.find(t => t.id === taskId)?.title || 'Unknown Task';
    
    setChecklistData(prev => {
      const newDayData = {
        ...prev[dateKey],
        [taskId]: { status: newStatus },
      };
      return { ...prev, [dateKey]: newDayData };
    });

    addAuditLog('UPDATE_STATUS', `Task "${taskTitle}" set to ${newStatus}`);
  };

  const handleDateChange = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  const handleSetToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: `task-${Date.now()}` };
    setTasks(prev => [...prev, newTask]);
    addAuditLog('CREATE_TASK', `New task added: "${newTask.title}"`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    addAuditLog('UPDATE_TASK', `Task updated: "${updatedTask.title}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskTitle = tasks.find(t => t.id === taskId)?.title || 'Unknown Task';
    setTasks(prev => prev.filter(task => task.id !== taskId));
    addAuditLog('DELETE_TASK', `Task deleted: "${taskTitle}"`);
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header
        currentDate={currentDate}
        onPrevDay={() => handleDateChange(-1)}
        onNextDay={() => handleDateChange(1)}
        onToday={handleSetToday}
        onShowReport={() => setActiveModal('report')}
        onManageTasks={() => setActiveModal('manageTasks')}
        onShowAuditLog={() => setActiveModal('auditLog')}
      />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
           <DailyChecklist
            tasks={tasksForSelectedDate}
            checklistData={checklistData[formatDateKey(currentDate)] || {}}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>

      {activeModal === 'report' && (
        <MonthlyReport
          onClose={() => setActiveModal(null)}
          checklistData={checklistData}
          tasks={tasks}
          isTaskScheduled={isTaskScheduled}
          initialDate={currentDate}
          employeeName={user}
        />
      )}

      {activeModal === 'manageTasks' && (
        <ManageTasksModal
            onClose={() => setActiveModal(null)}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
        />
      )}
      
      {activeModal === 'auditLog' && (
        <AuditLogModal 
            onClose={() => setActiveModal(null)}
            logs={auditLogs}
        />
      )}
    </div>
  );
}

export default App;
