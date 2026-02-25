import { ChevronRight } from 'lucide-react';

interface PathCardProps {
  isDark: boolean;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  questionsCount: number;
  isActive: boolean;
  onClick: () => void;
}

export function PathCard({
  isDark,
  title,
  description,
  icon: Icon,
  color,
  questionsCount,
  isActive,
  onClick
}: PathCardProps) {
  const getColorClasses = () => {
    const colors = {
      emerald: {
        border: isDark ? 'border-emerald-600 bg-emerald-900/10' : 'border-emerald-400 bg-emerald-50',
        icon: isDark ? 'bg-emerald-900/30' : 'bg-emerald-100',
        iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
        badge: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
      },
      purple: {
        border: isDark ? 'border-purple-600 bg-purple-900/10' : 'border-purple-400 bg-purple-50',
        icon: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
        iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
        badge: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
      },
      blue: {
        border: isDark ? 'border-blue-600 bg-blue-900/10' : 'border-blue-400 bg-blue-50',
        icon: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
        iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
        badge: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
      },
      cyan: {
        border: isDark ? 'border-cyan-600 bg-cyan-900/10' : 'border-cyan-400 bg-cyan-50',
        icon: isDark ? 'bg-cyan-900/30' : 'bg-cyan-100',
        iconColor: isDark ? 'text-cyan-400' : 'text-cyan-600',
        badge: isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
      },
      amber: {
        border: isDark ? 'border-amber-600 bg-amber-900/10' : 'border-amber-400 bg-amber-50',
        icon: isDark ? 'bg-amber-900/30' : 'bg-amber-100',
        iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
        badge: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
      }
    };

    return colors[color as keyof typeof colors];
  };

  const classes = getColorClasses();

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${classes.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${classes.icon}`}>
          <Icon className={`w-5 h-5 ${classes.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
            {title}
          </h4>
          <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${classes.badge}`}>
              {questionsCount} سؤال
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              isActive
                ? isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                : isDark ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              {isActive ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    </div>
  );
}
