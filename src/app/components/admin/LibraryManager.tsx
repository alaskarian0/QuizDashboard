import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, X, GraduationCap, FileText, Users, Clock, ChevronUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Unit, Node, CreateUnitDto, UpdateUnitDto, CreateNodeDto, UpdateNodeDto, LearningPathWithProgress } from '../../../types/learning-path';
import { useLearningPath, useCreateUnit, useUpdateUnit, useDeleteUnit, useCreateNode, useUpdateNode, useDeleteNode } from '../../../hooks/useLearningPath';
import { toast } from 'sonner';
import { PaginationWithControls } from './PaginationWithControls';

// Define Topic and Lesson types as aliases for Unit and Node
type Topic = Unit;
type Lesson = Node;

interface LibraryManagerProps {
  isDark: boolean;
}

export function LibraryManager({ isDark }: LibraryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('الكل');
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Unit | null>(null);
  const [managingLessons, setManagingLessons] = useState<Unit | null>(null);
  const [viewingTopic, setViewingTopic] = useState<Unit | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Fetch learning path data
  const { data: pathData, isLoading, error, refetch } = useLearningPath();
  const units = pathData?.units || [];

  const deleteUnitMutation = useDeleteUnit();
  const updateUnitMutation = useUpdateUnit();

  const difficulties = ['الكل', 'مبتدئ', 'متوسط', 'متقدم', 'جميع المستويات'];

  // Filter topics
  const filteredTopics = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [units, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTopics.slice(startIndex, endIndex);
  }, [filteredTopics, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteTopic = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
      try {
        await deleteUnitMutation.mutateAsync(id);
        toast.success('تم حذف الموضوع بنجاح');
      } catch (error: any) {
        toast.error(`فشل الحذف: ${error instanceof Error ? error.message : 'حدث خطأ ما'}`);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return isDark ? 'text-green-400 bg-green-900/30' : 'text-[#0AA1DD] bg-[#79DAE8]/20';
      case 'متوسط': return isDark ? 'text-amber-400 bg-amber-900/30' : 'text-[#2155CD] bg-[#0AA1DD]/20';
      case 'متقدم': return isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      default: return isDark ? 'text-blue-400 bg-blue-900/30' : 'text-[#2155CD] bg-[#79DAE8]/30';
    }
  };

  const stats = useMemo(() => {
    return {
      total: units.length,
      published: units.length,
      draft: 0,
      totalLessons: units.reduce((acc: number, t: Unit) => acc + (t.nodes?.length || 0), 0),
      totalUsers: 0
    };
  }, [units]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl">
        <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل المكتبة...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-12 rounded-2xl flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل المكتبة
        </p>
        <button
          onClick={() => refetch()}
          className={`px-6 py-2 rounded-xl ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-[#79DAE8]/30'}`}>
            <BookOpen className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-[#2155CD]'}`} />
          </div>
          <div>
            <h2 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-[#2155CD]'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              إدارة المكتبة
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إضافة وتعديل وحذف الوحدات التعليمية والدروس
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-[#79DAE8] to-[#0AA1DD]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-blue-100' : 'text-white/90'}`}>إجمالي الوحدات</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats.total}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-[#0AA1DD] to-[#2155CD]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-emerald-100' : 'text-white/90'}`}>الوحدات المنشورة</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats.published}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white border-2 border-[#79DAE8]'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-[#0AA1DD]'}`}>المسودات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-[#2155CD]'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats.draft}</h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white border-2 border-[#79DAE8]'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-[#0AA1DD]'}`}>إجمالي الدروس</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-[#2155CD]'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats.totalLessons}</h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white border-2 border-[#79DAE8]'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-[#0AA1DD]'}`}>المشتركون</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-[#2155CD]'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats.totalUsers}</h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="ابحث في الوحدات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              } outline-none`}
            />
          </div>

          <button
            onClick={() => setShowAddTopicModal(true)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-[#0AA1DD] hover:bg-[#2155CD] text-white'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5" />
            إضافة وحدة جديدة
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          الوحدات ({filteredTopics.length})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedTopics.map((unit) => (
            <div key={unit.id} className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-emerald-500/20">
                  📚
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                      {unit.title}
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={() => setViewingTopic(unit)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50' : 'bg-[#79DAE8]/30 text-[#0AA1DD] hover:bg-[#79DAE8]/50'}`} title="عرض"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setEditingTopic(unit)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-[#0AA1DD]/30 text-[#2155CD] hover:bg-[#0AA1DD]/50'}`} title="تعديل"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTopic(unit.id)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`} title="حذف"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{unit.description}</p>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl mb-4 ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <GraduationCap className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الدروس</p>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{unit.nodes?.length || 0}</p>
                </div>
                <div className="text-center">
                  <Clock className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الترتيب</p>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{unit.order}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setManagingLessons(unit)}
                  className={`flex-1 py-3 rounded-xl transition-all ${isDark ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
                >
                  إدارة المحتوى ({unit.nodes?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>

        {paginatedTopics.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'لا توجد وحدات تطابق البحث' : 'لا توجد وحدات'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTopics.length > 0 && (
        <PaginationWithControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTopics.length}
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

      {(showAddTopicModal || editingTopic) && (
        <TopicFormModal
          isDark={isDark}
          unit={editingTopic}
          onClose={() => {
            setShowAddTopicModal(false);
            setEditingTopic(null);
          }}
          onSave={async (u: any) => {
            setShowAddTopicModal(false);
            setEditingTopic(null);
          }}
        />
      )}

      {/* Lessons Manager Modal */}
      {managingLessons && (
        <LessonsManagerModal
          isDark={isDark}
          topic={managingLessons}
          onClose={() => setManagingLessons(null)}
          onUpdate={() => {
            // No need to manually set state, mutations will invalidate queries
          }}
        />
      )}

      {/* View Topic Modal */}
      {viewingTopic && (
        <ViewTopicModal
          isDark={isDark}
          unit={viewingTopic}
          onClose={() => setViewingTopic(null)}
        />
      )}
    </div>
  );
}

// Topic Form Modal
interface TopicFormModalProps {
  isDark: boolean;
  unit: Unit | null;
  onClose: () => void;
  onSave: (unit: Unit) => void;
}

function TopicFormModal({ isDark, unit, onClose, onSave }: TopicFormModalProps) {
  const [formData, setFormData] = useState<Partial<Unit>>(unit || {
    title: '',
    description: '',
    order: 0,
    nodes: []
  });

  const [showLessons, setShowLessons] = useState(true);

  const icons = ['✨', '⭐', '🤲', '🕯️', '📿', '🌙', '💎', '🕌', '☪️', '🌺', '📚', '🎓', '📖', '✍️'];
  const colors = ['#047857', '#065F46', '#CA8A04', '#DC2626', '#2563EB', '#7C3AED', '#DB2777'];
  const difficulties: ('مبتدئ' | 'متوسط' | 'متقدم' | 'جميع المستويات')[] = ['مبتدئ', 'متوسط', 'متقدم', 'جميع المستويات'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSave(formData as Unit);
    }
  };

  // إضافة درس جديد
  const handleAddLesson = () => {
    const newNode: Partial<Node> = {
      id: `temp-${Date.now()}`,
      title: '',
      content: '',
      type: 'LESSON',
      order: (formData.nodes?.length || 0) + 1
    };
    setFormData({
      ...formData,
      nodes: [...(formData.nodes || []), newNode as Node]
    });
  };

  // تحديث درس
  const handleUpdateNode = (nodeId: string, updates: Partial<Node>) => {
    setFormData({
      ...formData,
      nodes: formData.nodes?.map(n =>
        n.id === nodeId ? { ...n, ...updates } : n
      )
    });
  };

  // حذف درس
  const handleDeleteNode = (nodeId: string) => {
    setFormData({
      ...formData,
      nodes: formData.nodes?.filter(n => n.id !== nodeId)
    });
  };

  // ترتيب الدرس
  const handleMoveNode = (nodeId: string, direction: 'up' | 'down') => {
    const nodes = [...(formData.nodes || [])];
    const index = nodes.findIndex(n => n.id === nodeId);

    if (direction === 'up' && index > 0) {
      [nodes[index], nodes[index - 1]] = [nodes[index - 1], nodes[index]];
    } else if (direction === 'down' && index < nodes.length - 1) {
      [nodes[index], nodes[index + 1]] = [nodes[index + 1], nodes[index]];
    }

    // إعادة ترقيم الدروس
    nodes.forEach((node, idx) => {
      node.order = idx + 1;
    });

    setFormData({
      ...formData,
      nodes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'border-[#2a5a4d] bg-[#1A2C2B]' : 'border-gray-200 bg-white'} z-10`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {unit ? 'تعديل الموضوع' : 'إضافة موضوع جديد'}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              عنوان الموضوع *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
              } outline-none`}
              placeholder="مثال: أصول الدين الخمسة"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              الوصف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
              } outline-none`}
              placeholder="وصف الموضوع..."
            />
          </div>

          {/* Order */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              الترتيب *
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
              } outline-none`}
            />
          </div>

          {/* Lessons Section */}
          <div className={`border-2 border-dashed rounded-2xl p-6 ${isDark ? 'border-[#2a5a4d]' : 'border-gray-300'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  الدروس ({(formData.nodes || []).length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowLessons(!showLessons)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
              >
                {showLessons ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showLessons && (
              <div className="space-y-4">
                {(formData.nodes || []).map((node, index) => (
                  <div
                    key={node.id || index}
                    className={`p-4 rounded-xl border-2 ${
                      isDark ? 'bg-[#0D1B1A] border-[#2a5a4d]' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex flex-col gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <button
                          type="button"
                          onClick={() => handleMoveNode(node.id, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-900/30'}`}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveNode(node.id, 'down')}
                          disabled={index === (formData.nodes?.length || 0) - 1}
                          className={`p-1 rounded ${index === (formData.nodes?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-900/30'}`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                            #{node.order}
                          </div>
                          <input
                            type="text"
                            value={node.title}
                            onChange={(e) => handleUpdateNode(node.id, { title: e.target.value })}
                            placeholder="عنوان الدرس *"
                            required
                            className={`flex-1 px-3 py-2 rounded-lg border ${
                              isDark
                                ? 'bg-[#1A2C2B] border-[#2a5a4d] text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } outline-none focus:border-blue-500`}
                          />
                        </div>

                        <textarea
                          value={node.content}
                          onChange={(e) => handleUpdateNode(node.id, { content: e.target.value })}
                          placeholder="محتوى الدرس *"
                          rows={3}
                          required
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-[#1A2C2B] border-[#2a5a4d] text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } outline-none focus:border-blue-500`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteNode(node.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddLesson}
                  className={`w-full py-3 rounded-xl border-2 border-dashed transition-all ${
                    isDark
                      ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20'
                      : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                  }`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
                >
                  <Plus className="w-5 h-5 inline-block ml-2" />
                  إضافة درس جديد
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 sticky bottom-0 bg-inherit pt-4 border-t" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <button
              type="submit"
              className="flex-1 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all"
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              {unit ? 'حفظ التعديلات' : 'إضافة الموضوع'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] hover:bg-[#1A2C2B] text-white'
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

// Lessons Manager Modal
interface LessonsManagerModalProps {
  isDark: boolean;
  topic: Unit;
  onClose: () => void;
  onUpdate: (nodes: Node[]) => void;
}

function LessonsManagerModal({ isDark, topic, onClose, onUpdate }: LessonsManagerModalProps) {
  const [nodes, setNodes] = useState<Node[]>(topic.nodes || []);

  const handleAddNode = () => {
    const newNode: Partial<Node> = {
      id: `temp-${Date.now()}`,
      title: '',
      content: '',
      type: 'LESSON',
      order: nodes.length + 1
    };
    setNodes([...nodes, newNode as Node]);
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes(nodes.map(n =>
      n.id === nodeId ? { ...n, ...updates } : n
    ));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
  };

  const handleSave = () => {
    onUpdate(nodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'border-[#2a5a4d] bg-[#1A2C2B]' : 'border-gray-200 bg-white'} z-10`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                إدارة دروس: {topic.title}
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {nodes.length} دروس
              </p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {nodes.map((node, index) => (
            <div
              key={node.id || index}
              className={`p-4 rounded-xl border-2 ${
                isDark ? 'bg-[#0D1B1A] border-[#2a5a4d]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  #{node.order}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => handleUpdateNode(node.id, { title: e.target.value })}
                      placeholder="عنوان الدرس"
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-[#1A2C2B] border-[#2a5a4d] text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } outline-none focus:border-blue-500`}
                    />
                  </div>

                  <textarea
                    value={node.content}
                    onChange={(e) => handleUpdateNode(node.id, { content: e.target.value })}
                    placeholder="محتوى الدرس"
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-[#1A2C2B] border-[#2a5a4d] text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } outline-none focus:border-blue-500`}
                  />
                </div>

                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddNode}
            className={`w-full py-3 rounded-xl border-2 border-dashed transition-all ${
              isDark
                ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5 inline-block ml-2" />
            إضافة درس جديد
          </button>
        </div>

        <div className="p-6 border-t sticky bottom-0 bg-inherit" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all"
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              حفظ التغييرات
            </button>
            <button
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] hover:bg-[#1A2C2B] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Topic Modal
interface ViewTopicModalProps {
  isDark: boolean;
  unit: Unit;
  onClose: () => void;
}

function ViewTopicModal({ isDark, unit, onClose }: ViewTopicModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#0D1B1A]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${isDark ? 'bg-[#1A2C2B] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              عرض الموضوع
            </h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-blue-500/20">
              📚
            </div>
            <div>
              <h3 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {unit.title}
              </h3>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
            <h4 className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              الوصف
            </h4>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {unit.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
              <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {(unit.nodes || []).length}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>درس</p>
            </div>

            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
              <Clock className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <p className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {unit.order}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>الترتيب</p>
            </div>
          </div>

          {(unit.nodes || []).length > 0 && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
              <h4 className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                الدروس ({(unit.nodes || []).length})
              </h4>
              <div className="space-y-2">
                {(unit.nodes || []).map((node) => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg ${isDark ? 'bg-[#0D1B1A]' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {node.order}. {node.title || 'بدون عنوان'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-xl transition-all ${
              isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
