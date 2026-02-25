import { useDashboard } from '@/hooks/useDashboard';
import { RefreshCw, TrendingUp, Activity, Award, Library, Plus } from 'lucide-react';

interface DashboardPageProps {
  isDark: boolean;
}

export function DashboardPage({ isDark }: DashboardPageProps) {
  const { stats, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={isDark ? 'text-red-400' : 'text-red-600'}>
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  const quickActions = [
    { id: 'add-question', label: 'إضافة سؤال جديد', icon: Plus, color: 'emerald' },
    { id: 'add-category', label: 'إضافة فئة جديدة', icon: Library, color: 'blue' },
    { id: 'add-content', label: 'إضافة كتاب/مقال', icon: Plus, color: 'purple' },
    { id: 'settings', label: 'إعدادات النظام', icon: RefreshCw, color: 'gray' },
  ];

  const recentActivity = stats?.recentActivity || [
    { title: 'تم إضافة 5 أسئلة جديدة', category: 'أصول الدين', time: 'منذ ساعتين' },
    { title: 'انضم 23 مستخدم جديد', category: 'المستخدمين', time: 'منذ 6 ساعات' },
    { title: 'تم إنشاء فئة جديدة', category: 'واقعة كربلاء', time: 'أمس' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
            لوحة القيادة
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            مرحباً بك في لوحة التحكم الإدارية
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isDark
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-[#0AA1DD] text-white hover:bg-[#79DAE8]'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span>تحديث الإحصائيات</span>
        </button>
      </div>

      {/* Admin Info */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-md`}>
        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
          المدير: <span className="font-bold">{stats?.adminName || 'أحمد الحسيني'}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-100'}`}>
              <Activity className={`w-6 h-6 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{stats?.questionsThisMonth || 13} هذا الشهر</span>
            </div>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>إجمالي الأسئلة</p>
          <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {stats?.totalQuestions || 13}
          </h3>
        </div>

        {/* Total Users */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
              <Award className={`w-6 h-6 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{stats?.usersThisWeek || 5} هذا الأسبوع</span>
            </div>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>إجمالي المستخدمين</p>
          <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {stats?.totalUsers || 5}
          </h3>
        </div>

        {/* Accuracy Rate */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
              <Activity className={`w-6 h-6 ${isDark ? 'text-purple-500' : 'text-purple-600'}`} />
            </div>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>معدل الدقة</p>
          <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {stats?.accuracyRate || 0}%
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            عبر جميع الأسئلة
          </p>
        </div>

        {/* Total Categories */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-600/20' : 'bg-amber-100'}`}>
              <Library className={`w-6 h-6 ${isDark ? 'text-amber-500' : 'text-amber-600'}`} />
            </div>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>إجمالي الفئات</p>
          <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {stats?.totalCategories || 5}
          </h3>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] hover:bg-emerald-600/20 text-gray-300'
                    : 'bg-gray-50 hover:bg-[#0AA1DD]/10 text-gray-700'
                }`}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
            النشاط الأخير
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{activity.title}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{activity.category}</p>
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
