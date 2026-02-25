import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, BookOpen, X, FileQuestion, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/categories';
import { PaginationWithControls } from './PaginationWithControls';

interface CategoriesManagerProps {
  isDark: boolean;
}

export function CategoriesManager({ isDark }: CategoriesManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Fetch categories using the API hook
  const { data: categories = [], isLoading, error, refetch } = useCategories();

  // Pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  }, [categories, currentPage, itemsPerPage]);

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleDeleteCategory = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('تم حذف الدورة بنجاح');
        },
        onError: (error: Error) => {
          toast.error(`فشل حذف الدورة: ${error.message}`);
        }
      });
    }
  };

  const totalQuestions = categories.reduce((sum, cat) => sum + (cat.questionCount || cat._count?.questions || 0), 0);

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-12 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
            جاري تحميل الدورات...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-12 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <div className="text-center">
            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              فشل تحميل الدورات
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {error.message}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className={`px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-all`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                إدارة الدورات
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                0 دورات
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              <Plus className="w-5 h-5" />
              إضافة فئة جديدة
            </button>
          </div>
        </div>

        <div className={`p-12 rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
          <div className="flex flex-col items-center gap-4">
            <BookOpen className="w-16 h-16 text-gray-400" />
            <div className="text-center">
              <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                لا توجد دورات
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ابدأ بإضافة فئة جديدة لتنظيم الأسئلة
              </p>
            </div>
          </div>
        </div>

        {showAddModal && (
          <AddEditCategoryModal
            isDark={isDark}
            category={null}
            onClose={() => setShowAddModal(false)}
            onSave={(data) => {
              createMutation.mutate(data, {
                onSuccess: () => {
                  toast.success('تم إضافة الدورة بنجاح');
                  setShowAddModal(false);
                },
                onError: (error: Error) => {
                  toast.error(`فشل إضافة الدورة: ${error.message}`);
                }
              });
            }}
            isLoading={createMutation.isPending}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              إدارة الدورات
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {categories.length} دورات • {totalQuestions.toLocaleString('ar-SA')} سؤال إجمالي
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5" />
            إضافة فئة جديدة
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-white'
            }`}
          >
            {/* Category Header */}
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-[#0AA1DD]/30 text-[#2155CD] hover:bg-[#0AA1DD]/50'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
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

            {/* Category Info */}
            <div className="mb-4">
              <h4 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {category.name}
              </h4>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {category.description || 'لا يوجد وصف'}
              </p>
            </div>

            {/* Stats */}
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileQuestion className={`w-5 h-5`} style={{ color: category.color }} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    عدد الأسئلة
                  </span>
                </div>
                <span
                  className={`text-2xl`}
                  style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, color: category.color }}
                >
                  {category.questionCount || category._count?.questions || 0}
                </span>
              </div>

              {category.createdAt && (
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  تم الإنشاء: {new Date(category.createdAt).toLocaleDateString('ar-SA')}
                </div>
              )}
            </div>

            {/* Color Preview */}
            {category.color && (
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  اللون:
                </span>
                <div
                  className="w-6 h-6 rounded-lg shadow-sm border-2"
                  style={{
                    backgroundColor: category.color,
                    borderColor: isDark ? '#2a5a4d' : '#e5e5e5'
                  }}
                />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.color}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {categories.length > 0 && (
        <PaginationWithControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={categories.length}
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <AddEditCategoryModal
          isDark={isDark}
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
          onSave={(data) => {
            if (editingCategory) {
              updateMutation.mutate(
                { id: editingCategory.id, data },
                {
                  onSuccess: () => {
                    toast.success('تم تحديث الدورة بنجاح');
                    setEditingCategory(null);
                  },
                  onError: (error: Error) => {
                    toast.error(`فشل تحديث الدورة: ${error.message}`);
                  }
                }
              );
            } else {
              createMutation.mutate(data, {
                onSuccess: () => {
                  toast.success('تم إضافة الدورة بنجاح');
                  setShowAddModal(false);
                },
                onError: (error: Error) => {
                  toast.error(`فشل إضافة الدورة: ${error.message}`);
                }
              });
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

// Modal Component
interface AddEditCategoryModalProps {
  isDark: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  isLoading?: boolean;
}

function AddEditCategoryModal({ isDark, category, onClose, onSave, isLoading = false }: AddEditCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<CreateCategoryDto>>(category || {
    name: '',
    slug: '',
    description: '',
    icon: '📖',
    color: '#10B981'
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '') // Keep Arabic characters
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category?.slug || generateSlug(name)
    });
  };

  const predefinedIcons = ['📖', '👑', '⚔️', '🕌', '📚', '✨', '🌙', '⭐', '💎', '🔮', '📿', '☪️'];
  const predefinedColors = [
    '#10B981', // emerald
    '#8B5CF6', // purple
    '#EF4444', // red
    '#F59E0B', // amber
    '#3B82F6', // blue
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.slug) {
      onSave(formData as CreateCategoryDto);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'border-[#2a5a4d] bg-[#1A2C2B]' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {category ? 'تعديل الدورة' : 'إضافة فئة جديدة'}
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
          {/* Name */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              اسم الدورة *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } outline-none disabled:opacity-50`}
              placeholder="مثال: أصول الدين"
            />
          </div>

          {/* Slug */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              الرابط المختصر (Slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } outline-none disabled:opacity-50`}
              placeholder="usul-al-din"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              يتم إنشاؤه تلقائياً من الاسم، يمكنك تعديله يدوياً
            </p>
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
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } outline-none disabled:opacity-50`}
              placeholder="وصف الدورة..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              الأيقونة *
            </label>
            <div className="grid grid-cols-6 gap-3">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-4 text-3xl rounded-xl border-2 transition-all hover:scale-105 ${
                    formData.icon === icon
                      ? isDark
                        ? 'border-purple-500 bg-purple-900/30'
                        : 'border-purple-500 bg-purple-50'
                      : isDark
                        ? 'border-[#2a5a4d] bg-[#0D1B1A]'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
              اللون *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    formData.color === color
                      ? isDark
                        ? 'border-white'
                        : 'border-gray-900'
                      : isDark
                        ? 'border-[#2a5a4d]'
                        : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  <div className="h-8" />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className={`mt-3 w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } outline-none`}
              placeholder="#10B981"
            />
          </div>

          {/* Preview */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              معاينة:
            </p>
            <div className="flex items-center gap-4">
              {formData.icon && formData.color && (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {formData.icon}
                </div>
              )}
              <div>
                <h4 className={`text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  {formData.name || 'اسم الدورة'}
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formData.description || 'وصف الدورة'}
                </p>
                {formData.slug && (
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    slug: {formData.slug}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                category ? 'حفظ التعديلات' : 'إضافة الدورة'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] hover:bg-[#1A2C2B] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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