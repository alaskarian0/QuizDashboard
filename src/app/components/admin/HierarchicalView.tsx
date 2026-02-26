import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Folder, FileText, BookOpen, Loader2, AlertCircle, RefreshCw, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { StyledSelect } from './StyledSelect';
import { apiClient } from '../../../api/client';
import { useCreateStage, useCreateLevel } from '../../../hooks';
import type { CreateStageDto, CreateLevelDto } from '../../../types/stages';

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

interface UiLevel {
  id: string;
  name: string;
  description: string | null;
  order: number;
  questionCount: number;
  xpReward: number;
  difficulty: string;
  questions: Question[];
}

interface UiStage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  levels: UiLevel[];
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
  stages: UiStage[];
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

  // Modals state
  const [showStageModal, setShowStageModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');

  // Form state
  const [stageForm, setStageForm] = useState({ name: '', description: '', order: 0 });
  const [levelForm, setLevelForm] = useState({ name: '', description: '', order: 0, xpReward: 100, difficulty: 'MEDIUM' as const });

  // Use mutations for create operations
  const createStageMutation = useCreateStage();
  const createLevelMutation = useCreateLevel();

  // Loading state for add question operation
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Question search state
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [questionPage, setQuestionPage] = useState(1);
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const QUESTIONS_PER_PAGE = 10;

  // Random mode state - controls if items appear randomly to end users
  const [randomModeQuestions, setRandomModeQuestions] = useState<Set<string>>(new Set());
  const [randomModeLevels, setRandomModeLevels] = useState<Set<string>>(new Set());
  const [randomModeStages, setRandomModeStages] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/view-all');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);

      // Auto-expand first category, stage, and level
      if (result.data.categories.length > 0) {
        setExpandedCategories(new Set([result.data.categories[0].id]));
        if (result.data.categories[0].stages.length > 0) {
          setExpandedStages(new Set([result.data.categories[0].stages[0].id]));
          if (result.data.categories[0].stages[0].levels.length > 0) {
            setExpandedLevels(new Set([result.data.categories[0].stages[0].levels[0].id]));
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

  // Open stage modal
  const openStageModal = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStageForm({ name: '', description: '', order: 0 });
    setShowStageModal(true);
  };

  // Open level modal
  const openLevelModal = (stageId: string) => {
    setSelectedStageId(stageId);
    setLevelForm({ name: '', description: '', order: 0, xpReward: 100, difficulty: 'MEDIUM' });
    setShowLevelModal(true);
  };

  // Create stage
  const createStage = async () => {
    if (!stageForm.name) {
      toast.error('يرجى إدخال اسم القسم');
      return;
    }

    const slug = stageForm.name.toLowerCase().replace(/\s+/g, '-');
    const stageData: CreateStageDto = {
      name: stageForm.name,
      slug,
      description: stageForm.description || undefined,
      order: stageForm.order,
      categoryId: selectedCategoryId
    };

    try {
      const result = await createStageMutation.mutateAsync(stageData);
      toast.success('تم إضافة القسم بنجاح');
      setShowStageModal(false);

      // Optimistic update - add the new stage to local state
      const newStage = {
        id: result.id,
        name: stageForm.name,
        slug,
        description: stageForm.description,
        order: stageForm.order,
        levels: [],
        levelCount: 0,
        questionCount: 0
      };

      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map(cat => {
            if (cat.id === selectedCategoryId) {
              return {
                                        ...cat,
                                        stages: [...cat.stages, newStage]
                                      };
                                    }
                                    return cat;
                                  })
                                };
                              });

      // Keep the category expanded after adding
      setExpandedCategories(prev => new Set([...prev, selectedCategoryId]));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل إضافة القسم');
      console.error(error);
    }
  };

  // Create level
  const createLevel = async () => {
    if (!levelForm.name) {
      toast.error('يرجى إدخال اسم المستوى');
      return;
    }

    const levelData: CreateLevelDto = {
      name: levelForm.name,
      description: levelForm.description || undefined,
      order: levelForm.order,
      xpReward: levelForm.xpReward,
      difficulty: levelForm.difficulty,
      stageId: selectedStageId
    };

    try {
      const result = await createLevelMutation.mutateAsync(levelData);
      toast.success('تم إضافة المستوى بنجاح');
      setShowLevelModal(false);

      // Optimistic update - add the new level to local state
      const newLevel = {
        id: result.id,
        name: levelForm.name,
        description: levelForm.description,
        order: levelForm.order,
        xpReward: levelForm.xpReward,
        difficulty: levelForm.difficulty,
        questionCount: 0,
        questions: []
      };

      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map(cat => ({
            ...cat,
            stages: cat.stages.map(stage => {
              if (stage.id === selectedStageId) {
                return {
                  ...stage,
                  levels: [...stage.levels, newLevel],
                  levelCount: stage.levels.length + 1
                };
              }
              return stage;
            })
          }))
        };
      });

      // Keep both the category and stage expanded after adding
      const categoryWithStage = data?.categories.find(cat =>
        cat.stages.some(stage => stage.id === selectedStageId)
      );
      if (categoryWithStage) {
        setExpandedCategories(prev => new Set([...prev, categoryWithStage.id]));
      }
      setExpandedStages(prev => new Set([...prev, selectedStageId]));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل إضافة المستوى');
      console.error(error);
    }
  };

  // Open question modal
  const openQuestionModal = async (levelId: string, categoryId: string) => {
    setSelectedLevelId(levelId);
    setSelectedCategoryId(categoryId);
    setSelectedQuestions(new Set());
    setQuestionSearchTerm('');
    setQuestionPage(1);
    setShowQuestionModal(true);

    // Fetch available questions for this category using apiClient
    try {
      const result = await apiClient.get(`/questions?categoryId=${categoryId}`);
      setAvailableQuestions(result.data || result);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('فشل تحميل الأسئلة');
    }
  };

  // Toggle question selection
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Toggle random mode for questions, levels, stages
  const toggleRandomModeQuestion = (questionId: string) => {
    setRandomModeQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleRandomModeLevel = (levelId: string) => {
    setRandomModeLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(levelId)) {
        newSet.delete(levelId);
      } else {
        newSet.add(levelId);
      }
      return newSet;
    });
  };

  const toggleRandomModeStage = (stageId: string) => {
    setRandomModeStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  // Drag and drop handlers for questions in levels
  const handleDragStart = (questionId: string) => {
    setDraggedQuestionId(questionId);
  };

  const handleDragOver = (e: React.DragEvent, targetLevelId: string, targetQuestionId: string) => {
    e.preventDefault();
  };

  const handleDrop = async (targetLevelId: string, targetQuestionId: string) => {
    if (!draggedQuestionId || draggedQuestionId === targetQuestionId) return;

    // Find the level containing both questions
    const level = data?.categories
      .flatMap(cat => cat.stages)
      .flatMap(stage => stage.levels)
      .find(l => l.questions.some(q => q.id === draggedQuestionId || q.id === targetQuestionId));

    if (!level) return;

    // Reorder questions in local state
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map(cat => ({
          ...cat,
          stages: cat.stages.map(stage => ({
            ...stage,
            levels: stage.levels.map(l => {
              if (l.id === level.id) {
                const questions = [...l.questions];
                const draggedIndex = questions.findIndex(q => q.id === draggedQuestionId);
                const targetIndex = questions.findIndex(q => q.id === targetQuestionId);

                if (draggedIndex !== -1 && targetIndex !== -1) {
                  const [removed] = questions.splice(draggedIndex, 1);
                  questions.splice(targetIndex, 0, removed);
                }

                return { ...l, questions };
              }
              return l;
            })
          }))
        }))
      };
    });

    setDraggedQuestionId(null);
  };

  // Add selected questions to level
  const addQuestionsToLevel = async () => {
    if (selectedQuestions.size === 0) {
      toast.error('يرجى اختيار سؤال واحد على الأقل');
      return;
    }

    setIsAddingQuestion(true);
    try {
      // Update each question to link it to this level using apiClient
      const updatePromises = Array.from(selectedQuestions).map(questionId =>
        apiClient.patch(`/questions/${questionId}`, { levelId: selectedLevelId })
      );

      await Promise.all(updatePromises);

      toast.success(`تم إضافة ${selectedQuestions.size} أسئلة بنجاح`);
      setShowQuestionModal(false);

      // Optimistic update - add questions to the level in local state
      const questionsToAdd = availableQuestions.filter(q => selectedQuestions.has(q.id));

      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map(cat => ({
            ...cat,
            stages: cat.stages.map(stage => ({
              ...stage,
              levels: stage.levels.map(level => {
                if (level.id === selectedLevelId) {
                  return {
                    ...level,
                    questions: [...level.questions, ...questionsToAdd.map(q => ({
                                                      id: q.id,
                                                      text: q.text,
                                                      difficulty: q.difficulty,
                                                      correctAnswer: q.correctOption,
                                                      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                                                    }))],
                                                    questionCount: level.questionCount + questionsToAdd.length
                                                  };
                }
                return level;
              })
            }))
          }))
        };
      });

      // Keep the category, stage, and level expanded after adding questions
      const categoryWithStage = data?.categories.find(cat =>
        cat.stages.some(stage => stage.id === selectedStageId)
      );
      if (categoryWithStage) {
        setExpandedCategories(prev => new Set([...prev, categoryWithStage.id]));
      }
      setExpandedStages(prev => new Set([...prev, selectedStageId]));
      setExpandedLevels(prev => new Set([...prev, selectedLevelId]));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('token')) {
          toast.error('انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى');
        } else {
          toast.error(error.message || 'فشل إضافة الأسئلة');
        }
      } else {
        toast.error('فشل إضافة الأسئلة');
      }
      console.error(error);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  // Filter questions based on search
  const filteredQuestions = availableQuestions.filter(q =>
    q.text.toLowerCase().includes(questionSearchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (questionPage - 1) * QUESTIONS_PER_PAGE,
    questionPage * QUESTIONS_PER_PAGE
  );

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
                هيكلية شجرة البيانات من الدورات إلى الأسئلة
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
                <p className="text-sm opacity-90">الدورات</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalCategories}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">الأقسام</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalStages}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">المستويات</p>
                <h3 className="text-3xl font-cairo-bold">{data.summary.totalLevels}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}>
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
                    {category.stages.length} أقسام
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.questionCount} أسئلة
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openStageModal(category.id); }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة قسم</span>
                  </button>
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
                  {category.stages.length > 0 ? (
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleRandomModeStage(stage.id); }}
                              className={`px-2 py-1 rounded-lg text-xs font-cairo-medium transition-all ${
                                randomModeStages.has(stage.id)
                                  ? isDark
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-500 text-white'
                                  : isDark
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {randomModeStages.has(stage.id) ? '🎲 عشوائي' : 'ترتيبي'}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openLevelModal(stage.id); }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                                isDark ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة مستوى</span>
                            </button>
                            {expandedStages.has(stage.id) ? (
                              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                            ) : (
                              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                            )}
                          </div>
                        </div>

                        {/* Levels */}
                        {expandedStages.has(stage.id) && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1B1A] p-2">
                            {stage.levels.length > 0 ? (
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
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); toggleRandomModeLevel(level.id); }}
                                        className={`px-2 py-1 rounded-lg text-xs font-cairo-medium transition-all ${
                                          randomModeLevels.has(level.id)
                                            ? isDark
                                              ? 'bg-purple-600 text-white'
                                              : 'bg-purple-500 text-white'
                                            : isDark
                                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                      >
                                        {randomModeLevels.has(level.id) ? '🎲' : 'ترتيبي'}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openQuestionModal(level.id, category.id);
                                        }}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                          isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        }`}
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>إضافة سؤال</span>
                                      </button>
                                      {expandedLevels.has(level.id) ? (
                                        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                      ) : (
                                        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                      )}
                                    </div>
                                  </div>

                                  {/* Questions */}
                                  {expandedLevels.has(level.id) && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0D1B1A]/50 p-2">
                                      {level.questions.length > 0 ? (
                                        <div className="space-y-2">
                                          {level.questions.map((question, index) => (
                                            <div
                                              key={question.id}
                                              draggable
                                              onDragStart={() => handleDragStart(question.id)}
                                              onDragOver={(e) => handleDragOver(e, level.id, question.id)}
                                              onDrop={() => handleDrop(level.id, question.id)}
                                              className={`p-3 rounded-lg border-2 cursor-move transition-all ${
                                                isDark
                                                  ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-purple-500/50'
                                                  : 'bg-white border-gray-200 hover:border-purple-300'
                                              } ${draggedQuestionId === question.id ? 'opacity-50' : ''}`}
                                            >
                                              <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-cairo-bold cursor-grab active:cursor-grabbing ${
                                                  isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                                                }`}>
                                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                  </svg>
                                                </div>
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
                                                    <button
                                                      onClick={(e) => { e.stopPropagation(); toggleRandomModeQuestion(question.id); }}
                                                      className={`px-2 py-0.5 rounded text-xs font-cairo-medium transition-all ${
                                                        randomModeQuestions.has(question.id)
                                                          ? isDark
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-purple-500 text-white'
                                                          : isDark
                                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                      }`}
                                                    >
                                                      {randomModeQuestions.has(question.id) ? '🎲 عشوائي' : 'ترتيبي'}
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className={`p-6 text-center rounded-lg ${isDark ? 'bg-[#0D1B1A]' : 'bg-white'}`}>
                                          <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            لا توجد أسئلة في هذا المستوى
                                          </p>
                                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    يمكنك إضافة أسئلة من صفحة إدارة الأسئلة
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                              </div>
                            ) : (
                              <div className={`p-4 text-center rounded-lg ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                                <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  لا توجد مستويات في هذا القسم
                                </p>
                                <button
                                  onClick={() => openLevelModal(stage.id)}
                                  className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg mx-auto text-sm ${
                                    isDark ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>إضافة مستوى</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  ) : (
                    <div className={`p-6 text-center rounded-lg ${isDark ? 'bg-[#0D1B1A]' : 'bg-white'}`}>
                      <FolderOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-sm font-cairo-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        لا توجد أقسام في هذه الدورة
                      </p>
                      <button
                        onClick={() => openStageModal(category.id)}
                        className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl mx-auto ${
                          isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة قسم جديد</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Stage Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-md ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  إضافة قسم جديد
                </h3>
                <button
                  onClick={() => setShowStageModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    اسم القسم *
                  </label>
                  <input
                    type="text"
                    value={stageForm.name}
                    onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    placeholder="مثال: القسم الأول"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الوصف
                  </label>
                  <textarea
                    value={stageForm.description}
                    onChange={(e) => setStageForm({ ...stageForm, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    rows={3}
                    placeholder="وصف القسم..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={stageForm.order}
                    onChange={(e) => setStageForm({ ...stageForm, order: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createStage}
                  disabled={createStageMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                    isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  } ${createStageMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {createStageMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإضافة...</span>
                    </>
                  ) : (
                    'إضافة القسم'
                  )}
                </button>
                <button
                  onClick={() => setShowStageModal(false)}
                  disabled={createStageMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${createStageMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Level Modal */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-md ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  إضافة مستوى جديد
                </h3>
                <button
                  onClick={() => setShowLevelModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    اسم المستوى *
                  </label>
                  <input
                    type="text"
                    value={levelForm.name}
                    onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    placeholder="مثال: المستوى الأول"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الوصف
                  </label>
                  <textarea
                    value={levelForm.description}
                    onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    rows={3}
                    placeholder="وصف المستوى..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      الترتيب
                    </label>
                    <input
                      type="number"
                      value={levelForm.order}
                      onChange={(e) => setLevelForm({ ...levelForm, order: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        isDark
                          ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                      }`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      مكافأة XP
                    </label>
                    <input
                      type="number"
                      value={levelForm.xpReward}
                      onChange={(e) => setLevelForm({ ...levelForm, xpReward: parseInt(e.target.value) || 100 })}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        isDark
                          ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                      }`}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الصعوبة
                  </label>
                  <StyledSelect
                    value={levelForm.difficulty}
                    onChange={(value) => setLevelForm({ ...levelForm, difficulty: value })}
                    options={[
                      { value: 'EASY', label: 'سهل' },
                      { value: 'MEDIUM', label: 'متوسط' },
                      { value: 'HARD', label: 'صعب' }
                    ]}
                    isDark={isDark}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createLevel}
                  disabled={createLevelMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                    isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  } ${createLevelMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {createLevelMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإضافة...</span>
                    </>
                  ) : (
                    'إضافة المستوى'
                  )}
                </button>
                <button
                  onClick={() => setShowLevelModal(false)}
                  disabled={createLevelMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${createLevelMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`} style={{ maxHeight: '90vh' }}>
            <div className="p-6" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  إضافة أسئلة للمستوى
                </h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={questionSearchTerm}
                  onChange={(e) => {
                    setQuestionSearchTerm(e.target.value);
                    setQuestionPage(1);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                  }`}
                  placeholder="ابحث عن سؤال..."
                />
              </div>

              {/* Selected Questions Count */}
              {selectedQuestions.size > 0 && (
                <div className={`mb-4 p-3 rounded-xl ${isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                  <span className="font-cairo-medium">
                    تم اختيار {selectedQuestions.size} أسئلة
                  </span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-2 mb-6" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredQuestions.length === 0 ? (
                  <div className={`p-6 text-center rounded-lg ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {questionSearchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد أسئلة متاحة'}
                    </p>
                  </div>
                ) : (
                  paginatedQuestions.map((question) => {
                    const isSelected = selectedQuestions.has(question.id);
                    const isUsed = question.levelId !== null && question.levelId !== undefined;
                    return (
                      <div
                        key={question.id}
                        onClick={() => toggleQuestionSelection(question.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-600/20 border-emerald-500'
                              : 'bg-emerald-100 border-emerald-500'
                            : isUsed
                              ? isDark
                                ? 'bg-amber-600/10 border-amber-600/50 opacity-70'
                                : 'bg-amber-50 border-amber-300 opacity-70'
                              : isDark
                                ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-emerald-500/50'
                                : 'bg-white border-gray-200 hover:border-emerald-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? isDark
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-emerald-500 border-emerald-500'
                              : isUsed
                                ? 'border-amber-500'
                                : isDark
                                  ? 'border-gray-500'
                                  : 'border-gray-400'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-cairo-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {question.text}
                              </p>
                              {isUsed && (
                                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-cairo-medium ${
                                  isDark ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  مستخدم
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyBg(question.difficulty)}`}>
                                {getDifficultyBadge(question.difficulty)}
                              </span>
                              {question.categoryId && (
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  الدورة: {data?.categories.find(c => c.id === question.categoryId)?.name || '-'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mb-6 p-3 rounded-xl" style={{
                  backgroundColor: isDark ? '#0D1B1A' : '#f9fafb',
                  border: `2px solid ${isDark ? '#2a5a4d' : '#e5e5e5'}`
                }}>
                  <button
                    onClick={() => setQuestionPage(prev => Math.max(1, prev - 1))}
                    disabled={questionPage === 1}
                    className={`px-3 py-2 rounded-lg font-cairo-medium text-sm ${
                      questionPage === 1
                        ? isDark
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDark
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    السابق
                  </button>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-cairo-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      صفحة
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-cairo-bold ${
                      isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {questionPage} / {totalPages}
                    </span>
                    <span className={`text-sm font-cairo-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      ({filteredQuestions.length} أسئلة)
                    </span>
                  </div>

                  <button
                    onClick={() => setQuestionPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={questionPage === totalPages}
                    className={`px-3 py-2 rounded-lg font-cairo-medium text-sm ${
                      questionPage === totalPages
                        ? isDark
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDark
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    التالي
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={addQuestionsToLevel}
                  disabled={isAddingQuestion || selectedQuestions.size === 0}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                    isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  } ${(isAddingQuestion || selectedQuestions.size === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAddingQuestion ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإضافة...</span>
                    </>
                  ) : (
                    `إضافة ${selectedQuestions.size} أسئلة`
                  )}
                </button>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  disabled={isAddingQuestion}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isAddingQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
