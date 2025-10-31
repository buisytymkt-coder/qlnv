import { Task, DayOfWeek, AuditLogEntry } from './types';

export const EMPLOYEE_NAME = 'Nguyễn Văn A';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Kiểm tra và bổ sung hàng hóa lên quầy kệ',
    kpi: 'Đảm bảo tất cả các mặt hàng đều đầy đủ, sắp xếp gọn gàng theo đúng chuẩn trưng bày.',
    schedule: 'daily',
  },
  {
    id: '2',
    title: 'Vệ sinh khu vực bán hàng',
    kpi: 'Sàn nhà, quầy kệ, mặt kính sạch sẽ, không có rác thải.',
    schedule: 'daily',
  },
  {
    id: '3',
    title: 'Kiểm tra hạn sử dụng sản phẩm',
    kpi: 'Loại bỏ các sản phẩm hết hạn hoặc gần hết hạn theo quy định.',
    schedule: [DayOfWeek.Monday, DayOfWeek.Thursday],
  },
  {
    id: '4',
    title: 'Họp đầu ca',
    kpi: 'Tham gia họp để cập nhật thông tin khuyến mãi, sản phẩm mới.',
    schedule: 'daily',
  },
  {
    id: '5',
    title: 'Báo cáo cuối ca',
    kpi: 'Hoàn thành báo cáo doanh thu, hàng tồn và các vấn đề phát sinh.',
    schedule: 'daily',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
    { id: 'log1', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), user: 'admin', action: 'CREATE_TASK', details: 'Thêm công việc mới: Họp đầu ca' },
    { id: 'log2', timestamp: new Date(), user: EMPLOYEE_NAME, action: 'UPDATE_STATUS', details: 'Công việc "Vệ sinh khu vực bán hàng" đã được cập nhật thành "Đạt"' },
];
