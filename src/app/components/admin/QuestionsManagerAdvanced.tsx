import { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Filter, X } from 'lucide-react';
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from '@/hooks/useQuestions';
import { useCategories } from '@/hooks/useCategories';
import { QuestionFormModal } from './QuestionFormModal';
import { PaginationWithControls } from './PaginationWithControls';
import { StyledSelect } from './StyledSelect';
import type { Question as ApiQuestion, CreateQuestionDto, UpdateQuestionDto } from '@/types/questions';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionsManagerAdvancedProps {
  isDark: boolean;
}

export function QuestionsManagerAdvanced({ isDark }: QuestionsManagerAdvancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedDifficulty, setSelectedDifficulty] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch categories for filtering and adding
  const { data: categoriesData = [] } = useCategories();
  const categoryNames = useMemo(() => ['الكل', ...categoriesData.map(c => c.name)], [categoriesData]);

  const difficulties = ['الكل', 'سهل', 'متوسط', 'صعب'];

  // Fetch questions from API
  const { data: questionsResponse = [], isLoading, error } = useQuestions({
    categoryId: selectedCategory !== 'الكل' ? categoriesData.find(c => c.name === selectedCategory)?.id : undefined,
    difficulty: selectedDifficulty !== 'الكل' ? (selectedDifficulty === 'سهل' ? 'EASY' : selectedDifficulty === 'متوسط' ? 'MEDIUM' : 'HARD') : undefined,
  });

  // Transform API questions to our Question interface
  const transformedQuestions = useMemo(() => {
    return questionsResponse.map((q: any) => {
      let options: string[] = [];
      try {
        options = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || ['', '', '', '']);
      } catch (e) {
        console.error('Failed to parse options for question', q.id);
        options = ['', '', '', ''];
      }

      return {
        id: q.id,
        question: q.text || q.question || '',
        options: options,
        correctAnswer: q.correctOption ?? q.correctAnswer ?? 0
      };
    });
  }, [questionsResponse]);

  // Client-side search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return transformedQuestions;
    const query = searchQuery.toLowerCase();
    return transformedQuestions.filter((q: Question) =>
      q.question.toLowerCase().includes(query)
    );
  }, [transformedQuestions, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Update page when filters change
  useMemo(() => {
    resetPage();
  }, [searchQuery, selectedCategory, selectedDifficulty, resetPage]);

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowAddModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  const handleSaveQuestion = async (question: Question) => {
    try {
      // Get the category ID - use selected filter or first available category
      let categoryId: string | undefined;
      if (selectedCategory !== 'الكل') {
        categoryId = categoriesData.find(c => c.name === selectedCategory)?.id;
      }
      // If no category selected or filter is "All", use the first available category
      if (!categoryId && categoriesData.length > 0) {
        categoryId = categoriesData[0].id;
      }

      // Get difficulty - use selected filter or default to MEDIUM
      let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (selectedDifficulty !== 'الكل') {
        difficulty = selectedDifficulty === 'سهل' ? 'EASY' : selectedDifficulty === 'متوسط' ? 'MEDIUM' : 'HARD';
      }

      if (editingQuestion) {
        // Update existing question
        const updateData: UpdateQuestionDto = {
          text: question.question,
          options: question.options,
          correctOption: question.correctAnswer,
        };
        await updateMutation.mutateAsync({ id: editingQuestion.id, data: updateData });
      } else {
        // Create new question
        if (!categoryId) {
          throw new Error('No category available. Please create a category first.');
        }
        const createData: CreateQuestionDto = {
          text: question.question,
          options: question.options,
          correctOption: question.correctAnswer,
          categoryId,
          difficulty,
          explanation: '',
        };
        await createMutation.mutateAsync(createData);
      }
      setShowAddModal(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('فشل حفظ السؤال: ' + (error as Error).message);
    }
  };

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
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="ابحث عن سؤال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${
                isDark
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
          />

          {/* Difficulty Filter */}
          <StyledSelect
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            options={difficulties.map(diff => ({ value: diff, label: diff }))}
            isDark={isDark}
          />

          {/* Add Question Button */}
          <button
            onClick={handleAddQuestion}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              isDark
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

        {paginatedQuestions.map((question: Question) => (
          <div
            key={question.id}
            className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  {question.question}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {question.options.map((answer: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-2 ${
                        idx === question.correctAnswer
                          ? isDark ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
                          : isDark ? 'border-[#2a5a4d] bg-[#0D1B1A]' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm ${
                        idx === question.correctAnswer
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {idx + 1}. {answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-[#0AA1DD]/30 text-[#2155CD] hover:bg-[#0AA1DD]/50'
                  }`}
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
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {paginatedQuestions.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>لا توجد أسئلة تطابق معايير البحث</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredQuestions.length > 0 && (
        <PaginationWithControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredQuestions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
          isDark={isDark}
        />
      )}

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <QuestionFormModal
          isDark={isDark}
          question={editingQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}
