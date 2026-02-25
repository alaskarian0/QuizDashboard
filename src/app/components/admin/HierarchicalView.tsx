import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Folder, FileText, BookOpen, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface HierarchicalViewProps {
  isDark: boolean;
}

interface Question {
  id: string;
  text: string;
  difficulty: string;
  correctAnswer: number;
  options: string[];
}

interface Level {
  id: string;
  name: string;
  description: string | null;
  order: number;
  questionCount: number;
  xpReward: number;
  difficulty: string;
  questions: Question[];
}

interface Stage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  levels: Level[];
  levelCount: number;
  questionCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  stages: Stage[];
  questionCount: number;
}

interface Summary {
  totalCategories: number;
  totalStages: number;
  totalLevels: number;
  totalQuestions: number;
}

interface ApiResponse {
  categories: Category[];
  summary: Summary;
}

export function HierarchicalView({ isDark }: HierarchicalViewProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track expanded/collapsed nodes
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/view-all');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);

      // Auto-expand first category, stage, and level
      if (result.categories.length > 0) {
        setExpandedCategories(new Set([result.categories[0].id]));
        if (result.categories[0].stages.length > 0) {
          setExpandedStages(new Set([result.categories[0].stages[0].id]));
          if (result.categories[0].stages[0].levels.length > 0) {
            setExpandedLevels(new Set([result.categories[0].stages[0].levels[0].id]));
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(levelId)) {
        newSet.delete(levelId);
      } else {
        newSet.add(levelId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return isDark ? 'text-green-400' : 'text-green-600';
      case 'MEDIUM': return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'HARD': return isDark ? 'text-red-400' : 'text-red-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'سهل';
      case 'MEDIUM': return 'متوسط';
      case 'HARD': return 'صعب';
      default: return difficulty;
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700';
      case 'MEDIUM': return isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700';
      case 'HARD': return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700';
      default: return '';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`p-12 rounded-2xl flex flex-col items-center justify-center ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-500" />
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-12 rounded-2xl flex flex-col items-center justify-center ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </p>
        <button
          onClick={fetchData}
          className={`px-6 py-2 rounded-xl ${
            isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
          } font-cairo-semibold`}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <BookOpen className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                عرض جميع البيانات
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                هيكلية شجرة البيانات من الفئات إلى الأسئلة
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isDark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
        </div>

        {/* Summary Stats */}
        {data.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-[#79DAE8] to-[#0AA1DD]'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">الفئات</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalCategories}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">المراحل</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalStages}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-emerald-400 to-emerald-600)'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">المستويات</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalLevels}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 'bg-gradient-to-br from-amber-400 to-amber-600)'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">الأسئلة</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalQuestions}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hierarchical Tree */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <h3 className={`text-xl font-cairo-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          هيكل البيانات
        </h3>

        <div className="space-y-2">
          {data.categories.map((category) => (
            <div key={category.id} className="border-2 rounded-xl overflow-hidden" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                  isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}>
                    {category.icon || '📚'}
                  </div>
                  <div>
                    <h4 className={`text-lg font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {category.name}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description || 'لا يوجد وصف'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.stages.length} مراحل
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.questionCount} أسئلة
                  </span>
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </div>
              </div>

              {/* Stages */}
              {expandedCategories.has(category.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0D1B1A]/50 p-2">
                  <div className="space-y-2">
                    {category.stages.map((stage) => (
                      <div key={stage.id} className="border rounded-lg overflow-hidden" style={{ borderColor: isDark ? '#1A2C2B' : '#e5e5e5' }}>
                        {/* Stage Header */}
                        <div
                          onClick={() => toggleStage(stage.id)}
                          className={`p-3 cursor-pointer transition-all flex items-center justify-between ${
                            isDark ? 'hover:bg-[#1A2C2B]' : 'hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                            <div>
                              <h5 className={`font-cairo-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {stage.name}
                              </h5>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stage.levels.length} مستويات
                              </p>
                            </div>
                          </div>
                          {expandedStages.has(stage.id) ? (
                            <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                          )}
                        </div>

                        {/* Levels */}
                        {expandedStages.has(stage.id) && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1B1A] p-2">
                            <div className="space-y-2">
                              {stage.levels.map((level) => (
                                <div key={level.id} className="border rounded-lg overflow-hidden" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
                                  {/* Level Header */}
                                  <div
                                    onClick={() => toggleLevel(level.id)}
                                    className={`p-3 cursor-pointer transition-all flex items-center justify-between ${
                                      isDark ? 'hover:bg-[#1A2C2B]' : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <FileText className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                      <div className="flex-1">
                                        <h6 className={`text-sm font-cairo-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                          {level.name}
                                        </h6>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyBg(level.difficulty)}`}>
                                            {getDifficultyBadge(level.difficulty)}
                                          </span>
                                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {level.questionCount} أسئلة
                                          </span>
                                          <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            {level.xpReward} XP
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {expandedLevels.has(level.id) ? (
                                      <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                    ) : (
                                      <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                    )}
                                  </div>

                                  {/* Questions */}
                                  {expandedLevels.has(level.id) && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0D1B1A]/50 p-2 space-y-2">
                                      {level.questions.map((question, index) => (
                                        <div
                                          key={question.id}
                                          className={`p-3 rounded-lg border-2 ${
                                            isDark ? 'bg-[#0D1B1A] border-[#2a5a4d]' : 'bg-white border-gray-200'
                                          }`}
                                        >
                                          <div className="flex items-start gap-3">
                                            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-cairo-bold ${
                                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                              {index + 1}
                                            </span>
                                            <div className="flex-1">
                                              <p className={`text-sm font-cairo-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {question.text}
                                              </p>
                                              <div className="grid grid-cols-2 gap-2 text-xs">
                                                {question.options.map((option, idx) => (
                                                  <span
                                                    key={idx}
                                                    className={`px-2 py-1 rounded text-center ${
                                                      idx === question.correctAnswer
                                                        ? isDark
                                                          ? 'bg-emerald-600 text-white'
                                                          : 'bg-emerald-500 text-white'
                                                        : isDark
                                                          ? 'bg-gray-700 text-gray-300'
                                                          : 'bg-gray-200 text-gray-700'
                                                    }`}
                                                  >
                                                    {option}
                                                  </span>
                                                ))}
                                              </div>
                                              <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                                                  {getDifficultyBadge(question.difficulty)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
