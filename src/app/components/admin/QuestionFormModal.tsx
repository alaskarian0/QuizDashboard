import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StyledSelect } from './StyledSelect';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-3)
  categoryId?: string;
  stageId?: string;
  levelId?: string;
}

interface QuestionFormModalProps {
  isDark: boolean;
  question: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
}

interface Stage {
  id: string;
  name: string;
  levels: Level[];
}

interface Level {
  id: string;
  name: string;
}

interface CategoryWithStages {
  id: string;
  name: string;
  stages: Stage[];
}

export function QuestionFormModal({ isDark, question, onClose, onSave }: QuestionFormModalProps) {
  const [formData, setFormData] = useState<Question>(
    question || {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      categoryId: undefined,
      stageId: undefined,
      levelId: undefined,
    }
  );

  // Fetch categories with stages
  const { data: categoriesData } = useQuery({
    queryKey: ['view-all'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/view-all');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      return result.data.categories as CategoryWithStages[];
    },
  });

  const categories = categoriesData || [];

  // Get stages for selected category
  const selectedCategory = categories.find(c => c.id === formData.categoryId);
  const stages = selectedCategory?.stages || [];

  // Get levels for selected stage
  const selectedStage = stages.find(s => s.id === formData.stageId);
  const levels = selectedStage?.levels || [];

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      // Auto-select first category, stage, and level when adding new question
      if (categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory.stages.length > 0) {
          const firstStage = firstCategory.stages[0];
          if (firstStage.levels.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: firstCategory.id,
              stageId: firstStage.id,
              levelId: firstStage.levels[0].id,
            }));
          }
        }
      }
    }
  }, [question, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId) {
      alert('يرجى اختيار الدورة');
      return;
    }

    if (!formData.stageId) {
      alert('يرجى اختيار القسم');
      return;
    }

    if (!formData.levelId) {
      alert('يرجى اختيار المستوى');
      return;
    }

    if (!formData.question.trim()) {
      alert('يرجى إدخال نص السؤال');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      alert('يرجى إدخال جميع الخيارات الأربعة');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl ${
        isDark ? 'bg-[#0D1B1A]' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b ${
          isDark ? 'bg-[#1A2C2B] border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {question ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
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
          {/* Course, Section, Level Selection */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              موقع السؤال
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Course Selection */}
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  الدورة *
                </label>
                <StyledSelect
                  value={formData.categoryId || ''}
                  onChange={(value) => setFormData({
                    ...formData,
                    categoryId: value,
                    stageId: undefined,
                    levelId: undefined,
                  })}
                  options={[
                    { value: '', label: 'اختر الدورة' },
                    ...categories.map((category) => ({
                      value: category.id,
                      label: `${category.icon} ${category.name}`
                    }))
                  ]}
                  isDark={isDark}
                />
              </div>

              {/* Section Selection */}
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  القسم *
                </label>
                <StyledSelect
                  value={formData.stageId || ''}
                  onChange={(value) => setFormData({
                    ...formData,
                    stageId: value,
                    levelId: undefined,
                  })}
                  disabled={!formData.categoryId}
                  options={[
                    { value: '', label: 'اختر القسم' },
                    ...stages.map((stage) => ({
                      value: stage.id,
                      label: stage.name
                    }))
                  ]}
                  isDark={isDark}
                />
              </div>

              {/* Level Selection */}
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  المستوى *
                </label>
                <StyledSelect
                  value={formData.levelId || ''}
                  onChange={(value) => setFormData({ ...formData, levelId: value })}
                  disabled={!formData.stageId}
                  options={[
                    { value: '', label: 'اختر المستوى' },
                    ...levels.map((level) => ({
                      value: level.id,
                      label: level.name
                    }))
                  ]}
                  isDark={isDark}
                />
              </div>
            </div>

            <p className={`text-xs mt-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              💡 اختر الدورة ثم القسم ثم المستوى الذي تريد إضافة السؤال إليه
            </p>
          </div>

          {/* Question Text */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              نص السؤال
            </h3>

            <textarea
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="مثال: من هو أول الأئمة الاثني عشر عليهم السلام؟"
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                isDark
                  ? 'bg-[#0D1B1A] border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
              } outline-none`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            />
          </div>

          {/* Options */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              الخيارات (4 خيارات مطلوبة)
            </h3>

            <div className="space-y-4">
              {formData.options.map((option, index) => (
                <div key={index} className="relative">
                  <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                    الخيار {index + 1}
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Radio button for correct answer */}
                    <label className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.correctAnswer === index
                        ? isDark
                          ? 'bg-emerald-900/30 border-emerald-500'
                          : 'bg-emerald-100 border-emerald-500'
                        : isDark
                          ? 'bg-[#0D1B1A] border-gray-700 hover:border-gray-600'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="sr-only"
                      />
                      {formData.correctAnswer === index && (
                        <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                      )}
                    </label>

                    {/* Option input */}
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`مثال: ${index === 0 ? 'الإمام علي بن أبي طالب (ع)' : index === 1 ? 'الإمام الحسن (ع)' : index === 2 ? 'الإمام الحسين (ع)' : 'الإمام زين العابدين (ع)'}`}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                        formData.correctAnswer === index
                          ? isDark
                            ? 'bg-[#0D1B1A] border-emerald-500 text-white placeholder-gray-500'
                            : 'bg-white border-emerald-500 text-gray-900 placeholder-gray-400'
                          : isDark
                            ? 'bg-[#0D1B1A] border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                      } outline-none`}
                    />
                  </div>

                  {formData.correctAnswer === index && (
                    <p className={`text-xs mt-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ✓ هذا هو الجواب الصحيح
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className={`text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              💡 انقر على علامة ✓ بجانب الخيار الصحيح
            </p>
          </div>

          {/* Preview */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              معاينة السؤال
            </h3>

            <div className={`p-6 rounded-xl border-2 ${
              isDark ? 'bg-[#0D1B1A] border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                {formData.question || 'نص السؤال سيظهر هنا...'}
              </p>

              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.correctAnswer === index
                        ? isDark
                          ? 'bg-emerald-900/20 border-emerald-500'
                          : 'bg-emerald-50 border-emerald-500'
                        : isDark
                          ? 'bg-[#1A2C2B] border-gray-700'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        formData.correctAnswer === index
                          ? isDark
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 text-white'
                          : isDark
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-gray-200 text-gray-600'
                      }`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <p className={`${
                        formData.correctAnswer === index
                          ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                          : isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {option || `الخيار ${index + 1}`}
                      </p>
                      {formData.correctAnswer === index && (
                        <Check className={`w-5 h-5 mr-auto ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={3} />
                      )}
                    </div>
                  </div>
                ))}
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
              {question ? 'حفظ التعديلات' : 'إضافة السؤال'}
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
    </div>
  );
}
