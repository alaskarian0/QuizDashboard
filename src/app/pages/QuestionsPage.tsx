import { useQuestions } from '@/hooks/useQuestions';
import { QuestionsManagerAdvanced } from '@/app/components/admin/QuestionsManagerAdvanced';

interface QuestionsPageProps {
  isDark: boolean;
}

export function QuestionsPage({ isDark }: QuestionsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          إدارة الأسئلة
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          إضافة وتعديل وحذف أسئلة الاختبار
        </p>
      </div>

      {/* Questions Manager */}
      <QuestionsManagerAdvanced isDark={isDark} />
    </div>
  );
}
