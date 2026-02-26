import { CoursesManager } from '@/app/components/admin/CoursesManager';

interface CoursesPageProps {
  isDark: boolean;
}

export function CoursesPage({ isDark }: CoursesPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          إدارة الدورات
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          إضافة وتعديل وحذف دورات الأسئلة
        </p>
      </div>

      {/* Courses Manager */}
      <CoursesManager isDark={isDark} />
    </div>
  );
}
