import { CategoriesManager } from '@/app/components/admin/CategoriesManager';

interface CategoriesPageProps {
  isDark: boolean;
}

export function CategoriesPage({ isDark }: CategoriesPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          إدارة الفئات
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          إضافة وتعديل وحذف فئات الأسئلة
        </p>
      </div>

      {/* Categories Manager */}
      <CategoriesManager isDark={isDark} />
    </div>
  );
}
