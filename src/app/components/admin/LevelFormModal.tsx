import { useState, useEffect } from 'react';
import { X, Check, Lock, Trophy, BookOpen, Star, Target, Award, HelpCircle, Plus, Trash2, Edit } from 'lucide-react';
import { QuestionFormModal, Question } from '@/app/components/admin/QuestionFormModal';

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
  linkedQuestions: string[];
}

interface LevelFormModalProps {
  isDark: boolean;
  level: PathLevel | null;
  onClose: () => void;
  onSave: (level: PathLevel) => void;
}

export function LevelFormModal({ isDark, level, onClose, onSave }: LevelFormModalProps) {
  const [formData, setFormData] = useState<PathLevel>(
    level || {
      id: Date.now().toString(),
      title: '',
      description: '',
      xp: 10,
      requiredStars: 3,
      earnedStars: 0,
      status: 'locked',
      icon: 'lock',
      color: '#9ca3af',
      position: 1,
      questionsCount: 15,
      connectorType: 'right',
      isReview: false,
      isFinal: false,
      linkedQuestions: []
    }
  );

  useEffect(() => {
    if (level) {
      setFormData(level);
    }
  }, [level]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const iconOptions = [
    { value: 'check', label: 'علامة صح ✓', component: Check },
    { value: 'lock', label: 'قفل 🔒', component: Lock },
    { value: 'trophy', label: 'كأس 🏆', component: Trophy },
    { value: 'book', label: 'كتاب 📖', component: BookOpen },
    { value: 'star', label: 'نجمة ⭐', component: Star },
    { value: 'target', label: 'هدف 🎯', component: Target },
    { value: 'award', label: 'جائزة 🏅', component: Award }
  ];

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionAdd = (question: Question) => {
    setQuestions([...questions, question]);
    setIsQuestionModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleQuestionEdit = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    setIsQuestionModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleQuestionRemove = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsQuestionModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-[#0D1B1A]' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b ${
          isDark ? 'bg-[#1A2C2B] border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {level ? 'تعديل المستوى' : 'إضافة مستوى جديد'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-red-900/30 text-red-400' 
                  : 'hover:bg-red-100 text-red-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  عنوان المستوى *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: التوحيد"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                  } outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  رقم المستوى *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  وصف المستوى *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="مثال: أصل من أصول الدين الخمسة - الإيمان بوحدانية الله"
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                  } outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Progress Settings */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              إعدادات التقدم
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  نقاط XP *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  عدد الأسئلة *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.questionsCount}
                  onChange={(e) => setFormData({ ...formData, questionsCount: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  النجوم المطلوبة *
                </label>
                <select
                  value={formData.requiredStars}
                  onChange={(e) => setFormData({ ...formData, requiredStars: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                >
                  <option value="1">⭐ نجمة واحدة</option>
                  <option value="2">⭐⭐ نجمتان</option>
                  <option value="3">⭐⭐⭐ ثلاث نجوم</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  النجوم المكتسبة *
                </label>
                <select
                  value={formData.earnedStars}
                  onChange={(e) => setFormData({ ...formData, earnedStars: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                >
                  <option value="0">⭐ صفر</option>
                  <option value="1">⭐ واحدة</option>
                  <option value="2">⭐⭐ اثنتان</option>
                  <option value="3">⭐⭐⭐ ثلاث</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  الحالة *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                >
                  <option value="locked">🔒 مغلق</option>
                  <option value="current">🔓 حالي</option>
                  <option value="completed">✅ مكتمل</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  اتجاه الخط *
                </label>
                <select
                  value={formData.connectorType}
                  onChange={(e) => setFormData({ ...formData, connectorType: e.target.value as any })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                  } outline-none`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                >
                  <option value="right">➡️ يمين</option>
                  <option value="left">⬅️ يسار</option>
                </select>
              </div>
            </div>
          </div>

          {/* Type Settings */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              نوع المستوى
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.isReview
                  ? isDark
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-blue-500 bg-blue-50'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.isReview}
                  onChange={(e) => setFormData({ ...formData, isReview: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <p className={`text-sm ${formData.isReview ? 'text-blue-500' : isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                    📖 مستوى مراجعة
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    يعيد مراجعة المستويات السابقة
                  </p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.isFinal
                  ? isDark
                    ? 'border-amber-500 bg-amber-900/30'
                    : 'border-amber-500 bg-amber-50'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.isFinal}
                  onChange={(e) => setFormData({ ...formData, isFinal: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <p className={`text-sm ${formData.isFinal ? 'text-amber-500' : isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                    🏆 امتحان نهائي
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    اختبار شامل لجميع المستويات
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Questions Management */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  إدارة الأسئلة
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  أضف أسئلة خاصة بهذا المستوى مع 4 خيارات لكل سؤال
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  {questions.length} سؤال
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Questions List */}
              {questions.length > 0 ? (
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-4 rounded-xl border-2 ${
                        isDark ? 'bg-[#0D1B1A] border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                            }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                              {index + 1}
                            </div>
                            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                              {question.question}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mr-9">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                                  optIndex === question.correctAnswer
                                    ? isDark
                                      ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-500'
                                    : isDark
                                      ? 'bg-gray-800 text-gray-400'
                                      : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  optIndex === question.correctAnswer
                                    ? isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'
                                    : isDark ? 'bg-gray-700' : 'bg-gray-300'
                                }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className="flex-1 truncate">{option}</span>
                                {optIndex === question.correctAnswer && (
                                  <Check className="w-3 h-3" strokeWidth={3} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(question)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark 
                                ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuestionRemove(question.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark 
                                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 rounded-xl border-2 border-dashed text-center ${
                  isDark ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  <HelpCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    لم يتم إضافة أي أسئلة بعد
                  </p>
                </div>
              )}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedQuestion(null);
                  setIsQuestionModalOpen(true);
                }}
                className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/10'
                    : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                }`}
                style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
              >
                <Plus className="w-5 h-5" />
                إضافة سؤال جديد
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              معاينة
            </h3>
            
            <div className="flex justify-center">
              <div className="flex flex-col items-center w-32">
                <div className="relative">
                  {formData.status === 'current' && (
                    <div className="absolute inset-0 rounded-full opacity-20 blur-md animate-pulse" style={{ backgroundColor: formData.color }}></div>
                  )}
                  <div 
                    className={`relative w-20 h-20 rounded-full shadow-lg flex items-center justify-center ${
                      formData.status === 'current' ? 'ring-4 ring-amber-500' : ''
                    }`}
                    style={{ backgroundColor: formData.color }}
                  >
                    {(() => {
                      const IconComponent = iconOptions.find(i => i.value === formData.icon)?.component || Check;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                    {formData.title || 'عنوان المستوى'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{formData.xp} XP</p>
                  {formData.status !== 'locked' && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {Array.from({ length: formData.requiredStars }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < formData.earnedStars 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-gray-400'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 py-4 rounded-xl transition-all ${
                isDark 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              {level ? 'حفظ التعديلات' : 'إضافة المستوى'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl transition-all ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      {/* Question Form Modal */}
      {isQuestionModalOpen && (
        <QuestionFormModal
          isDark={isDark}
          question={selectedQuestion}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={selectedQuestion ? handleQuestionEdit : handleQuestionAdd}
        />
      )}
    </div>
  );
}
