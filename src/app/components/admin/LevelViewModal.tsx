import { X, Check, Lock, Trophy, BookOpen, Star, Target, Award } from 'lucide-react';

interface PathLevel {
  id: string;
  title: string;
  description: string;
  xp: number;
  requiredStars: number;
  earnedStars: number;
  status: 'completed' | 'current' | 'locked';
  icon: 'check' | 'lock' | 'trophy' | 'book' | 'star' | 'target' | 'award';
  color: string;
  position: number;
  questionsCount: number;
  connectorType: 'left' | 'right';
  isReview: boolean;
  isFinal: boolean;
}

interface LevelViewModalProps {
  isDark: boolean;
  level: PathLevel;
  onClose: () => void;
}

export function LevelViewModal({ isDark, level, onClose }: LevelViewModalProps) {
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'check': return <Check className="w-12 h-12 text-white" strokeWidth={3} />;
      case 'lock': return <Lock className="w-12 h-12 text-white" />;
      case 'trophy': return <Trophy className="w-12 h-12 text-white" />;
      case 'book': return <BookOpen className="w-12 h-12 text-white" />;
      case 'star': return <Star className="w-12 h-12 text-white" />;
      case 'target': return <Target className="w-12 h-12 text-white" />;
      case 'award': return <Award className="w-12 h-12 text-white" />;
      default: return <Check className="w-12 h-12 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
        isDark ? 'bg-[#0D1B1A]' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              تفاصيل المستوى
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-gray-800 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Level Icon & Title */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              {level.status === 'current' && (
                <div className="absolute inset-0 rounded-full opacity-20 blur-md animate-pulse" style={{ backgroundColor: level.color }}></div>
              )}
              <div 
                className={`relative w-32 h-32 rounded-full shadow-lg flex items-center justify-center ${
                  level.status === 'current' ? 'ring-4 ring-amber-500' : ''
                }`}
                style={{ backgroundColor: level.color }}
              >
                {getIconComponent(level.icon)}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm px-3 py-1 rounded-lg ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                المستوى {level.position}
              </span>
              {level.isReview && (
                <span className={`text-sm px-3 py-1 rounded-lg ${
                  isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  📖 مراجعة
                </span>
              )}
              {level.isFinal && (
                <span className={`text-sm px-3 py-1 rounded-lg ${
                  isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                }`}>
                  🏆 امتحان نهائي
                </span>
              )}
            </div>

            <h3 className={`text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {level.title}
            </h3>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {level.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الحالة</p>
              <p className={`text-lg ${
                level.status === 'completed' 
                  ? 'text-emerald-500'
                  : level.status === 'current'
                  ? 'text-amber-500'
                  : 'text-gray-500'
              }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {level.status === 'completed' ? '✅ مكتمل' : level.status === 'current' ? '🔓 حالي' : '🔒 مغلق'}
              </p>
            </div>

            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>نقاط XP</p>
              <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {level.xp}
              </p>
            </div>

            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>عدد الأسئلة</p>
              <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {level.questionsCount}
              </p>
            </div>

            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>النجوم المكتسبة</p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: level.requiredStars }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < level.earnedStars 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-400'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>اتجاه الخط</p>
              <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {level.connectorType === 'left' ? '⬅️ يسار' : '➡️ يمين'}
              </p>
            </div>

            <div className={`p-4 rounded-xl text-center ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>اللون</p>
              <div className="flex justify-center mt-2">
                <div 
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: level.color }}
                ></div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full py-4 rounded-xl transition-all ${
              isDark 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
