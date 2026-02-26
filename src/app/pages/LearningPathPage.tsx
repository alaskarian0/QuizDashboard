import { LearningPathManager } from '@/app/components/admin/LearningPathManager';

interface LearningPathPageProps {
  isDark: boolean;
}

export function LearningPathPage({ isDark }: LearningPathPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          المسار التعليمي
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          إدارة الوحدات والدروس التعليمية
        </p>
      </div>

      {/* Learning Path Manager */}
      <LearningPathManager isDark={isDark} />
    </div>
  );
}
