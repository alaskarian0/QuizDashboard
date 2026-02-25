import { useState } from 'react';
import { BookOpen, Target, ChevronRight, Plus, Settings, Eye, BarChart3, Trophy, Star, Calendar } from 'lucide-react';

interface PathsManagerProps {
  isDark: boolean;
}

type PathType = 'library' | 'path';

interface PathInfo {
  id: PathType;
  name: string;
  description: string;
  icon: any;
  color: string;
  questionsCount: number;
  activeQuestions: number;
  completedUsers: number;
}

export function PathsManager({ isDark }: PathsManagerProps) {
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);

  const paths: PathInfo[] = [
    {
      id: 'library',
      name: 'مكتبة المعرفة',
      description: 'أسئلة موزعة على فئات متعددة',
      icon: BookOpen,
      color: 'cyan',
      questionsCount: 450,
      activeQuestions: 420,
      completedUsers: 3240
    },
    {
      id: 'path',
      name: 'المسار التعليمي',
      description: 'إدارة مستويات المسار التعليمي',
      icon: Target,
      color: 'emerald',
      questionsCount: 150,
      activeQuestions: 145,
      completedUsers: 1200
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'gradient') => {
    const colors = {
      emerald: {
        bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
        text: isDark ? 'text-emerald-400' : 'text-emerald-600',
        gradient: isDark ? 'from-emerald-600 to-emerald-800' : 'from-emerald-400 to-emerald-600'
      },
      cyan: {
        bg: isDark ? 'bg-cyan-900/30' : 'bg-cyan-50',
        text: isDark ? 'text-cyan-400' : 'text-cyan-600',
        gradient: isDark ? 'from-cyan-600 to-cyan-800' : 'from-cyan-400 to-cyan-600'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  if (selectedPath) {
    const path = paths.find(p => p.id === selectedPath)!;
    return (
      <PathDetailsManager
        isDark={isDark}
        path={path}
        onBack={() => setSelectedPath(null)}
        getColorClasses={getColorClasses}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
        <h2 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          إدارة المسارات والمحتوى
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          اختر مساراً لإدارة الأسئلة والإعدادات الخاصة به
        </p>
      </div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(path.color, 'bg')}`}>
                  <Icon className={`w-6 h-6 ${getColorClasses(path.color, 'text')}`} />
                </div>
                <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {path.name}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {path.description}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الأسئلة</p>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                    {path.questionsCount}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>نشط</p>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                    {path.activeQuestions}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>مكمل</p>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                    {path.completedUsers}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Path Details Manager Component
interface PathDetailsManagerProps {
  isDark: boolean;
  path: PathInfo;
  onBack: () => void;
  getColorClasses: (color: string, type: 'bg' | 'text' | 'gradient') => string;
}

function PathDetailsManager({ isDark, path, onBack, getColorClasses }: PathDetailsManagerProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'settings' | 'stats'>('questions');
  const Icon = path.icon;

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
        <button
          onClick={onBack}
          className={`mb-4 px-4 py-2 rounded-xl transition-all ${isDark
              ? 'bg-[#0D1B1A] text-gray-300 hover:bg-[#1A2C2B]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
        >
          ← العودة
        </button>

        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${getColorClasses(path.color, 'bg')}`}>
            <Icon className={`w-8 h-8 ${getColorClasses(path.color, 'text')}`} />
          </div>
          <div>
            <h2 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {path.name}
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {path.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${getColorClasses(path.color, 'gradient')}`}>
          <div className="text-white">
            <p className="text-white/80 text-sm mb-1">إجمالي الأسئلة</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {path.questionsCount}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
          }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>الأسئلة النشطة</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {path.activeQuestions}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
          }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>أكمل</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {path.completedUsers.toLocaleString('ar-SA')}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div className={`p-2 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
        <div className="flex gap-2">
          {['questions', 'settings', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-6 py-3 rounded-xl transition-all ${activeTab === tab
                  ? getColorClasses(path.color, 'text') + ' ' + getColorClasses(path.color, 'bg')
                  : isDark
                    ? 'text-gray-400 hover:bg-[#0D1B1A]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              {tab === 'questions' ? 'الأسئلة' : tab === 'settings' ? 'الإعدادات' : 'الإحصائيات'}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
        <p className="text-center text-gray-500">محتوى {activeTab === 'questions' ? 'الأسئلة' : activeTab === 'settings' ? 'الإعدادات' : 'الإحصائيات'} متاح هنا</p>
      </div>
    </div>
  );
}
