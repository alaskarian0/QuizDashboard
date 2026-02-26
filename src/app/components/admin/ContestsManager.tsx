import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Trophy, Clock, X, Loader2, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  useContestsWithStatus,
  useCreateContest,
  useUpdateContest,
  useDeleteContest,
} from '../../../hooks';
import { useQuestions } from '../../../hooks/useQuestions';
import { StyledSelect } from './StyledSelect';
import type { ContestWithStatus, CreateContestDto, UpdateContestDto, ContestStatus } from '../../../types/contests';

interface ContestsManagerProps {
  isDark: boolean;
}

export function ContestsManager({ isDark }: ContestsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContest, setEditingContest] = useState<ContestWithStatus | null>(null);

  // Form state
  const [contestForm, setContestForm] = useState<CreateContestDto & { id?: string }>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    questions: [],
    rewardXP: 100,
  });

  // Question selection state
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  // Fetch data
  const { data: contests = [], isLoading, error, refetch } = useContestsWithStatus();
  const { data: questionsData = [] } = useQuestions();

  // Mutations
  const createContestMutation = useCreateContest();
  const updateContestMutation = useUpdateContest();
  const deleteContestMutation = useDeleteContest();

  // Filter contests
  const filteredContests = useMemo(() => {
    let result = contests;

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [contests, searchQuery, statusFilter]);

  // Handlers
  const openAddModal = () => {
    setEditingContest(null);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setContestForm({
      title: '',
      description: '',
      startTime: tomorrow.toISOString().slice(0, 16),
      endTime: nextWeek.toISOString().slice(0, 16),
      questions: [],
      rewardXP: 100,
    });
    setSelectedQuestionIds(new Set());
    setShowAddModal(true);
  };

  const openEditModal = (contest: ContestWithStatus) => {
    setEditingContest(contest);
    const questions = JSON.parse(contest.questions);
    setContestForm({
      id: contest.id,
      title: contest.title,
      description: contest.description || '',
      startTime: new Date(contest.startTime).toISOString().slice(0, 16),
      endTime: new Date(contest.endTime).toISOString().slice(0, 16),
      questions,
      rewardXP: contest.rewardXP,
    });
    setSelectedQuestionIds(new Set(questions));
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!contestForm.title || !contestForm.startTime || !contestForm.endTime) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (selectedQuestionIds.size === 0) {
      toast.error('يرجى اختيار سؤال واحد على الأقل');
      return;
    }

    const start = new Date(contestForm.startTime);
    const end = new Date(contestForm.endTime);

    if (end <= start) {
      toast.error('يجب أن يكون وقت الانتهاء بعد وقت البدء');
      return;
    }

    try {
      const data = {
        title: contestForm.title,
        description: contestForm.description,
        startTime: contestForm.startTime,
        endTime: contestForm.endTime,
        questions: Array.from(selectedQuestionIds),
        rewardXP: contestForm.rewardXP,
      };

      if (editingContest) {
        await updateContestMutation.mutateAsync({
          id: contestForm.id!,
          data,
        });
        toast.success('تم تحديث المسابقة بنجاح');
      } else {
        await createContestMutation.mutateAsync(data);
        toast.success('تم إضافة المسابقة بنجاح');
      }

      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to save contest:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المسابقة؟')) return;

    try {
      await deleteContestMutation.mutateAsync(id);
      toast.success('تم حذف المسابقة بنجاح');
    } catch (error) {
      console.error('Failed to delete contest:', error);
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: ContestStatus) => {
    const badges = {
      upcoming: { label: 'قادم', color: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' },
      active: { label: 'نشط', color: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700' },
      ended: { label: 'منتهي', color: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600' },
    };
    return badges[status];
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return '';
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) return `${days} يوم ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل المسابقات...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className={`text-red-500 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل البيانات
        </p>
      </div>
    );
  }

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'upcoming', label: 'قادمة' },
    { value: 'active', label: 'نشطة' },
    { value: 'ended', label: 'منتهية' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
              <Trophy className={`w-8 h-8 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                المسابقات
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                إدارة مسابقات المنافسة والجائزة
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="ابحث عن مسابقة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-12 pl-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
              }`}
            />
          </div>

          <StyledSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            isDark={isDark}
          />

          <button
            onClick={openAddModal}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
              isDark ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مسابقة</span>
          </button>
        </div>
      </div>

      {/* Contests List */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        {filteredContests.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-cairo-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery || statusFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد مسابقات حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredContests.map((contest) => {
              const statusBadge = getStatusBadge(contest.status);
              const questionCount = JSON.parse(contest.questions).length;

              return (
                <div
                  key={contest.id}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-amber-500/50' : 'bg-white border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`text-lg font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {contest.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-lg text-xs font-cairo-semibold ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      {contest.description && (
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contest.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Users className="w-4 h-4" />
                          <span>{questionCount} أسئلة</span>
                        </div>

                        <div className={`flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          <Trophy className="w-4 h-4" />
                          <span>{contest.rewardXP} XP</span>
                        </div>

                        {contest.status === 'active' && contest.timeRemaining && (
                          <div className={`flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Clock className="w-4 h-4" />
                            <span>متبقي: {formatTimeRemaining(contest.timeRemaining)}</span>
                          </div>
                        )}

                        {contest.status === 'upcoming' && contest.timeUntilStart && (
                          <div className={`flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            <Calendar className="w-4 h-4" />
                            <span>تبدأ خلال: {formatTimeRemaining(contest.timeUntilStart)}</span>
                          </div>
                        )}
                      </div>

                      <div className={`mt-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        <div>البدء: {formatDate(contest.startTime)}</div>
                        <div>الانتهاء: {formatDate(contest.endTime)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(contest)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark ? 'hover:bg-amber-900/30 text-amber-400' : 'hover:bg-amber-100 text-amber-600'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contest.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <div className="p-6 border-b" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingContest ? 'تعديل المسابقة' : 'إضافة مسابقة جديدة'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    عنوان المسابقة *
                  </label>
                  <input
                    type="text"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
                    }`}
                    placeholder="مثال: مسابقة الأسبوع"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الوصف
                  </label>
                  <textarea
                    value={contestForm.description}
                    onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
                    }`}
                    rows={3}
                    placeholder="وصف المسابقة..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      وقت البدء *
                    </label>
                    <input
                      type="datetime-local"
                      value={contestForm.startTime}
                      onChange={(e) => setContestForm({ ...contestForm, startTime: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        isDark
                          ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      وقت الانتهاء *
                    </label>
                    <input
                      type="datetime-local"
                      value={contestForm.endTime}
                      onChange={(e) => setContestForm({ ...contestForm, endTime: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        isDark
                          ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    مكافأة XP
                  </label>
                  <input
                    type="number"
                    value={contestForm.rewardXP}
                    onChange={(e) => setContestForm({ ...contestForm, rewardXP: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-amber-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500'
                    }`}
                    placeholder="100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-cairo-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      اختيار الأسئلة *
                    </label>
                    <span className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      تم اختيار {selectedQuestionIds.size} أسئلة
                    </span>
                  </div>
                  <div className={`max-h-48 overflow-y-auto rounded-xl border-2 p-3 space-y-2 ${
                    isDark ? 'bg-[#0D1B1A] border-[#2a5a4d]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    {questionsData.length === 0 ? (
                      <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        لا توجد أسئلة متاحة
                      </p>
                    ) : (
                      questionsData.map((question) => {
                        const isSelected = selectedQuestionIds.has(question.id);
                        return (
                          <label
                            key={question.id}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? isDark
                                  ? 'bg-amber-600/20 border border-amber-500/50'
                                  : 'bg-amber-100 border border-amber-300'
                                : isDark
                                  ? 'hover:bg-[#1A2C2B] border border-transparent'
                                  : 'hover:bg-white border border-transparent'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleQuestionSelection(question.id)}
                              className={`mt-1 w-4 h-4 rounded border-2 ${
                                isDark
                                  ? 'border-gray-500 text-amber-500 focus:ring-amber-500'
                                  : 'border-gray-400 text-amber-500 focus:ring-amber-500'
                              }`}
                            />
                            <div className="flex-1">
                              <p className={`text-sm font-cairo-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {question.text}
                              </p>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
              <button
                onClick={handleSave}
                disabled={createContestMutation.isPending || updateContestMutation.isPending}
                className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                  isDark ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-500 text-white hover:bg-amber-600'
                } ${(createContestMutation.isPending || updateContestMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {(createContestMutation.isPending || updateContestMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  'حفظ'
                )}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={createContestMutation.isPending || updateContestMutation.isPending}
                className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${(createContestMutation.isPending || updateContestMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
