import { UsersManager } from '@/app/components/admin/UsersManager';

interface UsersPageProps {
  isDark: boolean;
}

export function UsersPage({ isDark }: UsersPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
          إدارة المستخدمين
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          عرض وإدارة حسابات المستخدمين
        </p>
      </div>

      {/* Users Manager */}
      <UsersManager isDark={isDark} />
    </div>
  );
}
