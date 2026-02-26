import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, X } from 'lucide-react';
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from '../../../hooks/useQuestions';
import { useCategories } from '../../../hooks/useCategories';
import { StyledSelect } from './StyledSelect';
import type { Question as ApiQuestion, CreateQuestionDto, UpdateQuestionDto } from '../../../types/questions';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  answers: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt: string;
}

interface QuestionsManagerProps {
  isDark: boolean;
}

export function QuestionsManager({ isDark }: QuestionsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedDifficulty, setSelectedDifficulty] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  // Fetch categories for filtering and adding
  const { data: categoriesData = [] } = useCategories();
  const categoryNames = useMemo(() => ['الكل', ...categoriesData.map(c => c.name)], [categoriesData]);

  const difficulties = ['الكل', 'سهل', 'متوسط', 'صعب'];

  // Fetch questions from API
  const { data: questionsResponse = [], isLoading, error } = useQuestions({
    categoryId: selectedCategory !== 'الكل' ? categoriesData.find(c => c.name === selectedCategory)?.id : undefined,
    difficulty: selectedDifficulty !== 'الكل' ? (selectedDifficulty === 'سهل' ? 'EASY' : selectedDifficulty === 'متوسط' ? 'MEDIUM' : 'HARD') : undefined,
  });

  // Client-side search (as backend might not support it yet in this specific hook)
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questionsResponse;
    const query = searchQuery.toLowerCase();
    return questionsResponse.filter(q =>
      q.text.toLowerCase().includes(query) ||
      (q.explanation && q.explanation.toLowerCase().includes(query))
    );
  }, [questionsResponse, searchQuery]);

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
      case 'سهل': return isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-600 bg-emerald-100';
      case 'MEDIUM':
      case 'متوسط': return isDark ? 'text-amber-400 bg-amber-900/30' : 'text-amber-600 bg-amber-100';
      case 'HARD':
      case 'صعب': return isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      default: return '';
    }
  };

  const getDifficultyAr = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'سهل';
      case 'MEDIUM': return 'متوسط';
      case 'HARD': return 'صعب';
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className={`w-12 h-12 border-4 border-t-transparent animate-spin rounded-full ${isDark ? 'border-emerald-500' : 'border-blue-500'}`}></div>
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            <input
              type="text"
              placeholder="ابحث عن سؤال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${isDark
                ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white placeholder-gray-500 focus:border-emerald-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#2155CD]'
                } outline-none`}
            />
          </div>

          {/* Category Filter */}
          <StyledSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryNames.map(cat => ({ value: cat, label: cat }))}
            isDark={isDark}
            className="min-w-[150px]"
          />

          {/* Difficulty Filter */}
          <StyledSelect
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            options={difficulties.map(diff => ({ value: diff, label: diff }))}
            isDark={isDark}
            className="min-w-[150px]"
          />

          {/* Add Question Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${isDark
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#0AA1DD] hover:bg-[#2155CD] text-white'
              }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5" />
            إضافة سؤال
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          الأسئلة ({filteredQuestions.length})
        </h3>

        {filteredQuestions.map((question) => {
          let options: string[] = [];
          try {
            options = typeof (question as any).options === 'string' ? JSON.parse((question as any).options) : ((question as any).options || []);
          } catch (e) {
            console.error('Failed to parse options for question', question.id);
          }

          return (
            <div
              key={question.id}
              className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        {question.text}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#79DAE8]/30 text-[#0AA1DD]'}`}>
                          {(question as any).category?.name || 'بدون فئة'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                          {getDifficultyAr(question.difficulty)}
                        </span>
                        {(question as any).showAsChallenge && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                            ⚔️ تحدي يومي
                          </span>
                        )}
                        {(question as any).challengeOrder > 0 && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                            الترتيب: {(question as any).challengeOrder}
                          </span>
                        )}
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          تم الإنشاء: {new Date(question.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {Array.isArray(options) && options.map((answer: string, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border-2 ${idx === question.correctOption
                          ? isDark ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
                          : isDark ? 'border-[#2a5a4d] bg-[#0D1B1A]' : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <span className={`text-sm ${idx === question.correctOption
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          {idx + 1}. {answer}
                        </span>
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>التفسير:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className={`p-2 rounded-lg transition-all ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-[#0AA1DD]/30 text-[#2155CD] hover:bg-[#0AA1DD]/50'}`}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className={`p-2 rounded-lg transition-all ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>لا توجد أسئلة تطابق معايير البحث</p>
          </div>
        )}
      </div>

      {(showAddModal || editingQuestion) && (
        <AddEditQuestionModal
          isDark={isDark}
          question={editingQuestion}
          categories={categoriesData}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
          onSave={async (q) => {
            try {
              if (editingQuestion) {
                await updateMutation.mutateAsync({ id: editingQuestion.id, data: q as UpdateQuestionDto });
              } else {
                await createMutation.mutateAsync(q as CreateQuestionDto);
              }
              setShowAddModal(false);
              setEditingQuestion(null);
            } catch (error) {
              console.error('Failed to save question:', error);
            }
          }}
        />
      )}
    </div>
  );
}

interface AddEditQuestionModalProps {
  isDark: boolean;
  question: ApiQuestion | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSave: (question: Partial<CreateQuestionDto>) => void;
}

function AddEditQuestionModal({ isDark, question, categories, onClose, onSave }: AddEditQuestionModalProps) {
  const initialOptions = useMemo(() => {
    if (!question) return ['', '', '', ''];
    try {
      return typeof (question as any).options === 'string' ? JSON.parse((question as any).options) : ((question as any).options || ['', '', '', '']);
    } catch (e) {
      return ['', '', '', ''];
    }
  }, [question]);

  const [formData, setFormData] = useState({
    text: question?.text || '',
    categoryId: (question as any)?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    difficulty: question?.difficulty || 'MEDIUM',
    options: initialOptions,
    correctOption: question?.correctOption ?? 0,
    explanation: question?.explanation || '',
    showAsChallenge: question?.showAsChallenge || false,
    challengeOrder: question?.challengeOrder ?? 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text && formData.options.every((a: string) => a.trim())) {
      onSave({
        ...formData,
        options: formData.options as any // The backend expects string[] but we are passing stringified for now to match controller, or vice versa. Let's cast to any to fix lint and ensure it matches CreateQuestionDto expected by API.
      } as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'border-[#2a5a4d] bg-[#1A2C2B]' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {question ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
            </h3>
            <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}>
              <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>نص السؤال *</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={3}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500' : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'} outline-none`}
              placeholder="اكتب السؤال هنا..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>الدورة *</label>
              <StyledSelect
                value={formData.categoryId}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                isDark={isDark}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>مستوى الصعوبة *</label>
              <StyledSelect
                value={formData.difficulty}
                onChange={(value) => setFormData({ ...formData, difficulty: value as 'EASY' | 'MEDIUM' | 'HARD' })}
                options={[
                  { value: 'EASY', label: 'سهل' },
                  { value: 'MEDIUM', label: 'متوسط' },
                  { value: 'HARD', label: 'صعب' }
                ]}
                isDark={isDark}
              />
            </div>
          </div>

          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>الإجابات (حدد الإجابة الصحيحة) *</label>
            <div className="space-y-3">
              {formData.options.map((answer: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={formData.correctOption === idx}
                    onChange={() => setFormData({ ...formData, correctOption: idx })}
                    className="w-5 h-5 text-emerald-500"
                  />
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[idx] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    required
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500' : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'} outline-none`}
                    placeholder={`الإجابة ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>التفسير (اختياري)</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500' : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'} outline-none`}
              placeholder="اكتب توضيحاً للإجابة الصحيحة..."
            />
          </div>

          {/* Show as Challenge Toggle */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${isDark ? 'bg-[#0D1B1A] border-[#2a5a4d]' : 'bg-gray-50 border-gray-200'
              } hover:border-purple-500`}
            onClick={() => setFormData({ ...formData, showAsChallenge: !formData.showAsChallenge })}
          >
            <div className={`w-12 h-6 rounded-full transition-all relative ${formData.showAsChallenge ? 'bg-purple-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.showAsChallenge ? 'left-7' : 'left-1'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                عرض كتحدي يومي
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                سيتم عرض هذا السؤال كجزء من التحدي اليومي
              </p>
            </div>
          </div>

          {/* Challenge Order */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              ترتيب التحدي
            </label>
            <input
              type="number"
              value={formData.challengeOrder ?? 0}
              onChange={(e) => setFormData({ ...formData, challengeOrder: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${isDark
                ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                } outline-none`}
              placeholder="0"
              min="0"
            />
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              الأسئلة ذات الترتيب الأقل تظهر أولاً (0 = أعلى القائمة)
            </p>
          </div>

          <div className="flex gap-3">
            <button type="submit" className={`flex-1 py-3 rounded-xl transition-all ${isDark ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#0AA1DD] hover:bg-[#2155CD]'} text-white`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {question ? 'حفظ التعديلات' : 'إضافة السؤال'}
            </button>
            <button type="button" onClick={onClose} className={`flex-1 py-3 rounded-xl transition-all ${isDark ? 'bg-[#0D1B1A] hover:bg-[#1A2C2B] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}