import { LibraryManager } from '@/app/components/admin/LibraryManager';

interface LibraryPageProps {
  isDark: boolean;
}

export function LibraryPage({ isDark }: LibraryPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          إدارة المكتبة
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          إضافة وتعديل المحتوى التعليمي (مقالات، دروس، بودكاست، كتب)
        </p>
      </div>

      {/* Library Manager */}
      <LibraryManager isDark={isDark} />
    </div>
  );
}
