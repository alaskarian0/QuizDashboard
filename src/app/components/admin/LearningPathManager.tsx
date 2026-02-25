import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Check, HelpCircle } from 'lucide-react';
import { QuestionFormModal, Question } from '@/app/components/admin/QuestionFormModal';

interface LearningPathManagerProps {
  isDark: boolean;
  onBack?: () => void;
}

export function LearningPathManager({ isDark, onBack }: LearningPathManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'من هو أول الأئمة الاثني عشر عليهم السلام؟',
      options: [
        'الإمام علي بن أبي طالب (ع)',
        'الإمام الحسن المجتبى (ع)',
        'الإمام الحسين (ع)',
        'الإمام زين العابدين (ع)'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      question: 'كم عدد أصول الدين في المذهب الشيعي الإمامي؟',
      options: [
        'ثلاثة',
        'أربعة',
        'خمسة',
        'ستة'
      ],
      correctAnswer: 2
    },
    {
      id: '3',
      question: 'في أي عام هجري وقعت واقعة كربلاء؟',
      options: [
        '60 هـ',
        '61 هـ',
        '62 هـ',
        '63 هـ'
      ],
      correctAnswer: 1
    },
    {
      id: '4',
      question: 'ما هو لقب الإمام الحسين عليه السلام؟',
      options: [
        'سيد الشهداء',
        'الكرار',
        'الصادق',
        'الكاظم'
      ],
      correctAnswer: 0
    },
    {
      id: '5',
      question: 'أين يقع مرقد الإمام الرضا عليه السلام؟',
      options: [
        'النجف الأشرف',
        'كربلاء المقدسة',
        'مشهد',
        'الكاظمية'
      ],
      correctAnswer: 2
    },
    {
      id: '6',
      question: 'من هو آخر الأئمة الاثني عشر عليهم السلام؟',
      options: [
        'الإمام الحسن العسكري (ع)',
        'الإمام محمد المهدي (ع)',
        'الإمام علي الهادي (ع)',
        'الإمام محمد الجواد (ع)'
      ],
      correctAnswer: 1
    },
    {
      id: '7',
      question: 'ما هو أول أصل من أصول الدين الخمسة؟',
      options: [
        'العدل',
        'النبوة',
        'التوحيد',
        'الإمامة'
      ],
      correctAnswer: 2
    },
    {
      id: '8',
      question: 'من هي سيدة نساء العالمين؟',
      options: [
        'السيدة خديجة (ع)',
        'السيدة فاطمة الزهراء (ع)',
        'السيدة زينب (ع)',
        'السيدة مريم (ع)'
      ],
      correctAnswer: 1
    }
  ]);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDeleteQuestion = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, question]);
    setShowAddModal(false);
  };

  const handleEditQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    setEditingQuestion(null);
  };

  const getStats = () => {
    return {
      total: questions.length,
      categories: new Set(questions.map(() => 'عام')).size,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
          }`}>
            <HelpCircle className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <div>
            <h2 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              إدارة بنك الأسئلة
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إضافة وتعديل وحذف أسئلة الاختبارات الإسلامية الشيعية
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
        }`}>
          <div className="text-white">
            <p className="text-emerald-100 text-sm mb-1">إجمالي الأسئلة</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.total}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>نتائج البحث</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {filteredQuestions.length}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>التصنيفات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.categories}
          </h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="ابحث في الأسئلة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white placeholder-gray-500 focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
              } outline-none`}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
              isDark 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5" />
            إضافة سؤال جديد
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          الأسئلة ({filteredQuestions.length})
        </h3>

        {filteredQuestions.length > 0 ? (
          <div className="space-y-3">
            {filteredQuestions.map((question, index) => (
              <div
                key={question.id}
                className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                  isDark ? 'bg-[#1A2C2B]' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Question Number & Text */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                      }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {index + 1}
                      </div>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        {question.question}
                      </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-13">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-xl transition-all ${
                            optIndex === question.correctAnswer
                              ? isDark
                                ? 'bg-emerald-900/30 border-2 border-emerald-500'
                                : 'bg-emerald-50 border-2 border-emerald-500'
                              : isDark
                                ? 'bg-[#0D1B1A] border-2 border-gray-700'
                                : 'bg-gray-50 border-2 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              optIndex === question.correctAnswer
                                ? isDark
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-500 text-white'
                                : isDark
                                  ? 'bg-gray-800 text-gray-400'
                                  : 'bg-gray-200 text-gray-600'
                            }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                              {String.fromCharCode(65 + optIndex)}
                            </div>
                            <p className={`flex-1 text-sm ${
                              optIndex === question.correctAnswer
                                ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                                : isDark ? 'text-gray-300' : 'text-gray-700'
                            }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                              {option}
                            </p>
                            {optIndex === question.correctAnswer && (
                              <Check className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={3} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setViewingQuestion(question)}
                      className={`p-2 rounded-lg transition-all ${
                        isDark 
                          ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                          : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                      }`}
                      title="عرض"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className={`p-2 rounded-lg transition-all ${
                        isDark 
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title="تعديل"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className={`p-2 rounded-lg transition-all ${
                        isDark 
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center rounded-2xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-white'
          }`}>
            <HelpCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              لا توجد أسئلة
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Question Modal */}
      {(showAddModal || editingQuestion) && (
        <QuestionFormModal
          isDark={isDark}
          question={editingQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
          onSave={editingQuestion ? handleEditQuestion : handleAddQuestion}
        />
      )}

      {/* View Question Modal */}
      {viewingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-3xl rounded-2xl shadow-2xl ${
            isDark ? 'bg-[#0D1B1A]' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isDark ? 'bg-[#1A2C2B] border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  عرض السؤال
                </h2>
                <button
                  onClick={() => setViewingQuestion(null)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'hover:bg-red-900/30 text-red-400' 
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Question */}
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  نص السؤال
                </h3>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  {viewingQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  الخيارات
                </h3>
                <div className="space-y-3">
                  {viewingQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all ${
                        index === viewingQuestion.correctAnswer
                          ? isDark
                            ? 'bg-emerald-900/30 border-2 border-emerald-500'
                            : 'bg-emerald-50 border-2 border-emerald-500'
                          : isDark
                            ? 'bg-[#0D1B1A] border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === viewingQuestion.correctAnswer
                            ? isDark
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-500 text-white'
                            : isDark
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-gray-200 text-gray-600'
                        }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <p className={`flex-1 ${
                          index === viewingQuestion.correctAnswer
                            ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                            : isDark ? 'text-gray-300' : 'text-gray-700'
                        }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                          {option}
                        </p>
                        {index === viewingQuestion.correctAnswer && (
                          <div className="flex items-center gap-2">
                            <Check className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={3} />
                            <span className={`text-sm px-3 py-1 rounded-full ${
                              isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'
                            }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                              إجابة صحيحة
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setViewingQuestion(null)}
                className={`w-full py-4 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
