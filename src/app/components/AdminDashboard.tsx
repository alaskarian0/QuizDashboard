import { useState } from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
  Plus,
  TrendingUp,
  Activity,
  Award,
  Library,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { QuestionsManagerAdvanced } from '@/app/components/admin/QuestionsManagerAdvanced';
import { UsersManager } from '@/app/components/admin/UsersManager';
import { CategoriesManager } from '@/app/components/admin/CategoriesManager';
import { LibraryManager } from '@/app/components/admin/LibraryManager';
import { useDashboard } from '@/hooks/useDashboard';

interface AdminDashboardProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

type ActiveTab = 'overview' | 'questions' | 'users' | 'categories' | 'library';

export function AdminDashboard({ isDark, onToggleTheme, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Fetch dashboard statistics from API
  const { stats, isLoading, error, refetch } = useDashboard();

  const menuItems = [
    { id: 'overview' as ActiveTab, icon: LayoutDashboard, label: 'لوحة القيادة', color: 'emerald' },
    { id: 'questions' as ActiveTab, icon: FileQuestion, label: 'إدارة الأسئلة', color: 'blue' },
    { id: 'categories' as ActiveTab, icon: BookOpen, label: 'إدارة الفئات', color: 'purple' },
    { id: 'users' as ActiveTab, icon: Users, label: 'إدارة المستخدمين', color: 'amber' },
    { id: 'library' as ActiveTab, icon: Library, label: 'إدارة المكتبة', color: 'indigo' },
  ];

  return (
    <div
      dir="rtl"
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0D1B1A]' : 'bg-[#F9F6ED]'
        }`}
      style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 ${isDark ? 'bg-[#1A2C2B] border-l border-[#2a5a4d]' : 'bg-white border-l border-gray-200'
          } flex flex-col`}>
          {/* Logo */}
          <div className="p-6 border-b border-opacity-20" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <h1
              className={`text-2xl text-center ${isDark ? 'text-white' : 'text-[#222222]'}`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              🎓 لوحة التحكم
            </h1>
            <p className={`text-center text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              نور المعرفة
            </p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                    ? isDark
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-[#0AA1DD] text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-[#0D1B1A]'
                      : 'text-gray-700 hover:bg-[#79DAE8]/20'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-opacity-20 space-y-2" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <button
              onClick={onToggleTheme}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-gray-300 hover:bg-[#0D1B1A]' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                {isDark ? 'الوضع الداكن' : 'الوضع الفاتح'}
              </span>
            </button>
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                }`}
            >
              <LogOut className="w-5 h-5" />
              <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                تسجيل الخروج
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className={`sticky top-0 z-10 ${isDark ? 'bg-[#1A2C2B]/95 border-b border-[#2a5a4d]' : 'bg-white/95 border-b border-gray-200'
            } backdrop-blur-sm`}>
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
                  >
                    {menuItems.find(item => item.id === activeTab)?.label}
                  </h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    مرحباً بك في لوحة التحكم الإدارية
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Refresh Button - Only show on overview tab */}
                  {activeTab === 'overview' && (
                    <button
                      onClick={() => refetch()}
                      disabled={isLoading}
                      className={`p-2 rounded-xl transition-all ${isLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105'
                        } ${isDark
                          ? 'bg-[#0D1B1A] text-emerald-400 hover:bg-emerald-900/20'
                          : 'bg-gray-100 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      title="تحديث الإحصائيات"
                    >
                      <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  )}

                  <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-100'
                    }`}>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      المدير: أحمد الحسيني
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Error State */}
                {error && (
                  <div className={`p-4 rounded-xl border-2 ${isDark
                      ? 'bg-red-900/20 border-red-700 text-red-300'
                      : 'bg-red-50 border-red-300 text-red-700'
                    }`}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold">فشل تحميل الإحصائيات</p>
                        <p className="text-sm opacity-80">{error.message}</p>
                      </div>
                      <button
                        onClick={() => refetch()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark
                            ? 'bg-red-700 hover:bg-red-600 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>إعادة المحاولة</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Total Questions Card */}
                  <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-[#79DAE8] to-[#0AA1DD]'
                    }`}>
                    <div className="flex items-start justify-between text-white">
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-emerald-100' : 'text-white/90'}`}>إجمالي الأسئلة</p>
                        {isLoading ? (
                          <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-2"></div>
                        ) : (
                          <h3 className="text-3xl mb-2" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            {stats?.totalQuestions ? stats.totalQuestions.toLocaleString('ar-SA') : '0'}
                          </h3>
                        )}
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>
                            {isLoading ? (
                              <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
                            ) : (
                              `+${stats?.questionsAddedThisMonth || 0} هذا الشهر`
                            )}
                          </span>
                        </div>
                      </div>
                      <FileQuestion className="w-10 h-10 opacity-80" />
                    </div>
                  </div>

                  {/* Total Users Card */}
                  <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-[#0AA1DD] to-[#2155CD]'
                    }`}>
                    <div className="flex items-start justify-between text-white">
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-blue-100' : 'text-white/90'}`}>إجمالي المستخدمين</p>
                        {isLoading ? (
                          <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-2"></div>
                        ) : (
                          <h3 className="text-3xl mb-2" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            {stats?.totalUsers ? stats.totalUsers.toLocaleString('ar-SA') : '0'}
                          </h3>
                        )}
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>
                            {isLoading ? (
                              <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
                            ) : (
                              `+${stats?.newUsersThisWeek || 0} هذا الأسبوع`
                            )}
                          </span>
                        </div>
                      </div>
                      <Users className="w-10 h-10 opacity-80" />
                    </div>
                  </div>

                  {/* Average Accuracy Card */}
                  <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-[#2155CD] to-[#0AA1DD]'
                    }`}>
                    <div className="flex items-start justify-between text-white">
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-purple-100' : 'text-white/90'}`}>معدل الدقة</p>
                        {isLoading ? (
                          <div className="h-9 w-16 bg-white/20 rounded animate-pulse mb-2"></div>
                        ) : (
                          <h3 className="text-3xl mb-2" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            {stats?.averageAccuracy ?? 0}%
                          </h3>
                        )}
                        <div className="flex items-center gap-1 text-sm">
                          <Activity className="w-4 h-4" />
                          <span>عبر جميع الأسئلة</span>
                        </div>
                      </div>
                      <Award className="w-10 h-10 opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Categories Card */}
                  <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي الفئات</p>
                        {isLoading ? (
                          <div className={`h-9 w-16 rounded animate-pulse mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        ) : (
                          <h3 className={`text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            {stats?.totalCategories ?? 0}
                          </h3>
                        )}
                      </div>
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                        <BookOpen className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate Card */}
                  <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>معدل الإكمال</p>
                        {isLoading ? (
                          <div className={`h-9 w-16 rounded animate-pulse mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        ) : (
                          <h3 className={`text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            {stats?.completionRate ?? 0}%
                          </h3>
                        )}
                      </div>
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                        <Activity className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                  }`}>
                  <h3
                    className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
                  >
                    إجراءات سريعة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${isDark
                          ? 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/20'
                          : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                        }`}
                    >
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <span className="block text-center" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        إضافة سؤال جديد
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('categories')}
                      className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${isDark
                          ? 'border-purple-600 text-purple-400 hover:bg-purple-900/20'
                          : 'border-purple-500 text-purple-600 hover:bg-purple-50'
                        }`}
                    >
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <span className="block text-center" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        إضافة فئة جديدة
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('library')}
                      className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${isDark
                          ? 'border-indigo-600 text-indigo-400 hover:bg-indigo-900/20'
                          : 'border-indigo-500 text-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                      <Library className="w-6 h-6 mx-auto mb-2" />
                      <span className="block text-center" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        إضافة كتاب/مقال
                      </span>
                    </button>

                    <button
                      className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${isDark
                          ? 'border-amber-600 text-amber-400 hover:bg-amber-900/20'
                          : 'border-amber-500 text-amber-600 hover:bg-amber-50'
                        }`}
                    >
                      <Settings className="w-6 h-6 mx-auto mb-2" />
                      <span className="block text-center" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        إعدادات النظام
                      </span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                  }`}>
                  <h3
                    className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
                  >
                    النشاط الأخير
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'تم إضافة 5 أسئلة جديدة', category: 'أصول الدين', time: 'منذ ساعتين', color: 'emerald' },
                      { action: 'انضم 23 مستخدم جديد', category: 'المستخدمين', time: 'منذ 6 ساعات', color: 'blue' },
                      { action: 'تم إنشاء فئة جديدة', category: 'واقعة كربلاء', time: 'أمس', color: 'purple' },
                    ].map((activity, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`} />
                        <div className="flex-1">
                          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {activity.action}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {activity.category}
                          </p>
                        </div>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && <QuestionsManagerAdvanced isDark={isDark} />}
            {activeTab === 'users' && <UsersManager isDark={isDark} />}
            {activeTab === 'categories' && <CategoriesManager isDark={isDark} />}
            {activeTab === 'library' && <LibraryManager isDark={isDark} />}
          </div>
        </main>
      </div>
    </div>
  );
}