import { useState, useMemo } from 'react';
import { RotateCcw, CheckCircle, XCircle, Eye, Loader2, BookOpen, TrendingUp, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  useWrongAnswersForReview,
  useAnswerStats,
  useRecordAnswer,
} from '../../../hooks';
import { StyledSelect } from './StyledSelect';
import type { WrongAnswerReview } from '../../../types/review';

interface ReviewManagerProps {
  isDark: boolean;
}

type ReviewMode = 'list' | 'review' | 'results';

export function ReviewManager({ isDark }: ReviewManagerProps) {
  const [mode, setMode] = useState<ReviewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewResults, setReviewResults] = useState<{
    total: number;
    correct: number;
    improved: string[];
    mastered: string[];
  }>({ total: 0, correct: 0, improved: [], mastered: [] });

  const { data: wrongAnswers = [], isLoading, error, refetch } = useWrongAnswersForReview();
  const { data: stats } = useAnswerStats();
  const recordAnswerMutation = useRecordAnswer();

  // Filter wrong answers by category
  const filteredAnswers = useMemo(() => {
    if (selectedCategory === 'all') return wrongAnswers;
    return wrongAnswers.filter(a => a.question?.categoryId === selectedCategory);
  }, [wrongAnswers, selectedCategory]);

  const currentQuestion = filteredAnswers[currentIndex];
  const progress = currentIndex + 1;
  const totalQuestions = filteredAnswers.length;

  // Get unique categories from wrong answers
  const categories = useMemo(() => {
    const cats = new Set(wrongAnswers.map(a => a.question?.categoryId).filter(Boolean));
    return Array.from(cats);
  }, [wrongAnswers]);

  const startReview = () => {
    if (filteredAnswers.length === 0) {
      toast.error('لا توجد أسئلة خاطئة للمراجعة');
      return;
    }
    setCurrentIndex(0);
    setReviewResults({ total: filteredAnswers.length, correct: 0, improved: [], mastered: [] });
    setMode('review');
  };

  const handleAnswer = async (answerIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correctOption;
    const wasPreviouslyWrong = answerIndex !== currentQuestion.userWrongAnswer;

    try {
      await recordAnswerMutation.mutateAsync({
        questionId: currentQuestion.questionId,
        answer: answerIndex,
      });

      // Update results
      const newResults = { ...reviewResults };
      newResults.total++;

      if (isCorrect) {
        newResults.correct++;
        newResults.mastered.push(currentQuestion.questionId);
        toast.success('إجابة صحيحة! أحسنت! 🎉', {
          description: 'لقد أتقنت هذا السؤال',
        });
      } else {
        if (wasPreviouslyWrong) {
          newResults.improved.push(currentQuestion.questionId);
          toast.info('لا بأس، حاول مرة أخرى!', {
            description: 'الإجابة الصحيحة محددة باللون الأخضر',
          });
        } else {
          toast.error('إجابة خاطئة', {
            description: 'راجع الإجابة الصحيية وحاول مرة أخرى',
          });
        }
      }

      setReviewResults(newResults);

      // Move to next question or show results
      if (currentIndex < filteredAnswers.length - 1) {
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, isCorrect ? 1500 : 3000);
      } else {
        setTimeout(() => {
          setMode('results');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to record answer:', error);
      toast.error('فشل تسجيل الإجابة');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700';
      case 'MEDIUM':
        return isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700';
      case 'HARD':
        return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  const getDifficultyAr = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'سهل';
      case 'MEDIUM':
        return 'متوسط';
      case 'HARD':
        return 'صعب';
      default:
        return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-red-500 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل البيانات
        </p>
      </div>
    );
  }

  // ==================== LIST MODE ====================
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">مجموع الإجابات</p>
                <h3 className="text-3xl font-cairo-bold">{stats.total}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">إجابات صحيحة</p>
                <h3 className="text-3xl font-cairo-bold">{stats.correct}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">إجابات خاطئة</p>
                <h3 className="text-3xl font-cairo-bold">{stats.incorrect}</h3>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
              <div className="text-white">
                <p className="text-sm opacity-90">نسبة الدقة</p>
                <h3 className="text-3xl font-cairo-bold">{stats.accuracy.toFixed(1)}%</h3>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <RotateCcw className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  مراجعة الإجابات الخاطئة
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  راجع الأسئلة التي أجبت عليها بشكل خاطئ وتعلم من أخطائك
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {filteredAnswers.length > 0 && (
                <button
                  onClick={startReview}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
                    isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>بدء المراجعة ({filteredAnswers.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <StyledSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: 'all', label: 'جميع الفئات' },
                ...categories.map(catId => ({
                  value: catId,
                  label: wrongAnswers.find(a => a.question?.categoryId === catId)?.question?.category?.name || catId,
                })),
              ]}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Wrong Answers List */}
        <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          {filteredAnswers.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-emerald-600' : 'text-emerald-500'}`} />
              <p className={`text-lg font-cairo-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {wrongAnswers.length === 0
                  ? 'رائع! لا توجد إجابات خاطئة'
                  : 'لا توجد إجابات خاطئة في هذه الفئة'}
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {wrongAnswers.length === 0 && 'أنت تسير على الطريق الصحيح! استمر في التعلم'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnswers.map((item) => {
                const question = item.question;
                if (!question) return null;

                const options = typeof question.options === 'string'
                  ? JSON.parse(question.options)
                  : question.options;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-red-500/50'
                        : 'bg-white border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-red-900/30' : 'bg-red-100'
                      }`}>
                        <XCircle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                      </div>

                      <div className="flex-1">
                        <p className={`font-cairo-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {question.text}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          {options.map((option: string, idx: number) => {
                            const isCorrectAnswer = idx === question.correctOption;
                            const isUserWrongAnswer = idx === item.answer;

                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? isDark
                                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                      : 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : isUserWrongAnswer
                                      ? isDark
                                        ? 'bg-red-600/20 border-red-500 text-red-400'
                                        : 'bg-red-100 border-red-500 text-red-700'
                                      : isDark
                                        ? 'bg-[#1A2C2B] border-[#2a5a4d] text-gray-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                                  {isUserWrongAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 flex-shrink-0" />}
                                  <span className="text-sm">{option}</span>
                                </div>
                                {isCorrectAnswer && (
                                  <span className="text-xs mt-1 block opacity-75">✓ الإجابة الصحيحة</span>
                                )}
                                {isUserWrongAnswer && !isCorrectAnswer && (
                                  <span className="text-xs mt-1 block opacity-75">✗ إجابتك الخاطئة</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          {question.difficulty && (
                            <span className={`px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyAr(question.difficulty)}
                            </span>
                          )}
                          {question.explanation && (
                            <div className={`flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              <Lightbulb className="w-3 h-3" />
                              <span>يوجد شرح للسؤال</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== REVIEW MODE ====================
  if (mode === 'review' && currentQuestion) {
    const question = currentQuestion.question;
    const options = typeof question?.options === 'string'
      ? JSON.parse(question.options)
      : question?.options || [];

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                <BookOpen className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  جلسة المراجعة
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  السؤال {progress} من {totalQuestions}
                </p>
              </div>
            </div>
            <div className={`text-sm font-cairo-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {reviewResults.correct} / {reviewResults.total} صحيحة
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(progress / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className="mb-6">
            <p className={`text-xl font-cairo-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {question.text}
            </p>
            {question.explanation && (
              <div className={`p-4 rounded-xl mt-4 ${isDark ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-start gap-2">
                  <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-cairo-semibold text-sm mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                      شرح السؤال:
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={recordAnswerMutation.isPending}
                className={`p-4 rounded-xl border-2 text-right transition-all hover:scale-[1.02] ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-purple-500 hover:bg-purple-900/20'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                } ${recordAnswerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`font-cairo-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Previous Wrong Answer Hint */}
          <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-2">
              <TrendingUp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <div>
                <p className={`font-cairo-semibold text-sm mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  تلميح: لاحظ أنك أجبت هذا السؤال بشكل خاطئ مسبقاً
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  اختر بعناية! الإجابة الصحيحة محددة باللون الأخضر في قائمة المراجعة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESULTS MODE ====================
  if (mode === 'results') {
    const accuracy = reviewResults.total > 0 ? (reviewResults.correct / reviewResults.total) * 100 : 0;
    const improvement = reviewResults.improved.length;
    const mastered = reviewResults.mastered.length;

    return (
      <div className="space-y-6">
        <div className={`p-8 rounded-2xl shadow-lg text-center ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}>
            <Award className="w-10 h-10 text-white" />
          </div>

          <h2 className={`text-3xl font-cairo-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {accuracy >= 80 ? 'ممتاز!' : accuracy >= 50 ? 'جيد!' : 'استمر في المحاولة!'}
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {accuracy >= 80
              ? 'لقد أتقنت معظم الأسئلة!'
              : accuracy >= 50
                ? 'بداية جيدة، استمر في المراجعة'
                : 'التعلم يستغرق وقتاً، حاول مرة أخرى'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
              <div className={`text-3xl font-cairo-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {reviewResults.correct}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                إجابات صحيحة
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
              <div className={`text-3xl font-cairo-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {improvement}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                تحسن في الإجابة
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <div className={`text-3xl font-cairo-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {mastered}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                أسئلة أتقنتها
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                refetch();
                setMode('list');
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
                isDark ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              <span>مراجعة مرة أخرى</span>
            </button>
            <button
              onClick={() => setMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>عرض قائمة الأخطاء</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
