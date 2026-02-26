import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, X, Video, Headphones, FileText, Loader2, AlertCircle, Newspaper, GraduationCap } from 'lucide-react';
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle, useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, usePodcasts, useCreatePodcast, useUpdatePodcast, useDeletePodcast, useEBooks, useCreateEBook, useUpdateEBook, useDeleteEBook, useLibraryStats } from '@/hooks/useLibrary';
import type { Article, Lesson as LessonType, Podcast, EBook, CreateArticleDto, CreateLessonDto, CreatePodcastDto, CreateEBookDto, LibraryContentType } from '@/types/library';
import { toast } from 'sonner';
import { PaginationWithControls } from './PaginationWithControls';

interface LibraryManagerProps {
  isDark: boolean;
}

export function LibraryManager({ isDark }: LibraryManagerProps) {
  const [activeTab, setActiveTab] = useState<LibraryContentType>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Article | LessonType | Podcast | EBook | null>(null);
  const [viewingItem, setViewingItem] = useState<Article | LessonType | Podcast | EBook | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch data for each content type
  const { data: articles = [], isLoading: articlesLoading, error: articlesError, refetch: refetchArticles } = useArticles();
  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError, refetch: refetchLessons } = useLessons();
  const { data: podcasts = [], isLoading: podcastsLoading, error: podcastsError, refetch: refetchPodcasts } = usePodcasts();
  const { data: ebooks = [], isLoading: ebooksLoading, error: ebooksError, refetch: refetchEBooks } = useEBooks();
  const { data: stats } = useLibraryStats();

  // Mutations
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const createPodcastMutation = useCreatePodcast();
  const updatePodcastMutation = useUpdatePodcast();
  const deletePodcastMutation = useDeletePodcast();
  const createEBookMutation = useCreateEBook();
  const updateEBookMutation = useUpdateEBook();
  const deleteEBookMutation = useDeleteEBook();

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'articles': return articles as any[];
      case 'lessons': return lessons as any[];
      case 'podcasts': return podcasts as any[];
      case 'ebooks': return ebooks as any[];
      default: return [];
    }
  }, [activeTab, articles, lessons, podcasts, ebooks]);

  const currentLoading = useMemo(() => {
    switch (activeTab) {
      case 'articles': return articlesLoading;
      case 'lessons': return lessonsLoading;
      case 'podcasts': return podcastsLoading;
      case 'ebooks': return ebooksLoading;
      default: return false;
    }
  }, [activeTab, articlesLoading, lessonsLoading, podcastsLoading, ebooksLoading]);

  const currentError = useMemo(() => {
    switch (activeTab) {
      case 'articles': return articlesError;
      case 'lessons': return lessonsError;
      case 'podcasts': return podcastsError;
      case 'ebooks': return ebooksError;
      default: return null;
    }
  }, [activeTab, articlesError, lessonsError, podcastsError, ebooksError]);

  const currentRefetch = useMemo(() => {
    switch (activeTab) {
      case 'articles': return refetchArticles;
      case 'lessons': return refetchLessons;
      case 'podcasts': return refetchPodcasts;
      case 'ebooks': return refetchEBooks;
      default: return () => {};
    }
  }, [activeTab, refetchArticles, refetchLessons, refetchPodcasts, refetchEBooks]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery && selectedCategory === 'all') return currentData;
    return currentData.filter((item: any) => {
      const matchesSearch = !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [currentData, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, activeTab]);

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      try {
        switch (activeTab) {
          case 'articles':
            await deleteArticleMutation.mutateAsync(id);
            break;
          case 'lessons':
            await deleteLessonMutation.mutateAsync(id);
            break;
          case 'podcasts':
            await deletePodcastMutation.mutateAsync(id);
            break;
          case 'ebooks':
            await deleteEBookMutation.mutateAsync(id);
            break;
        }
        toast.success('تم الحذف بنجاح');
      } catch (error: any) {
        toast.error(`فشل الحذف: ${error instanceof Error ? error.message : 'حدث خطأ ما'}`);
      }
    }
  };

  const getTabIcon = (tab: LibraryContentType) => {
    switch (tab) {
      case 'articles': return Newspaper;
      case 'lessons': return Video;
      case 'podcasts': return Headphones;
      case 'ebooks': return BookOpen;
    }
  };

  const getTabLabel = (tab: LibraryContentType) => {
    switch (tab) {
      case 'articles': return 'المقالات';
      case 'lessons': return 'الدروس';
      case 'podcasts': return 'البودكاست';
      case 'ebooks': return 'الكتب';
    }
  };

  const tabs: LibraryContentType[] = ['articles', 'lessons', 'podcasts', 'ebooks'];

  // Loading state
  if (currentLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl">
        <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل {getTabLabel(activeTab)}...
        </p>
      </div>
    );
  }

  // Error state
  if (currentError) {
    return (
      <div className="p-12 rounded-2xl flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل البيانات
        </p>
        <button
          onClick={() => currentRefetch()}
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
              إضافة وتعديل المحتوى التعليمي (مقالات، دروس، بودكاست، كتب)
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-[#79DAE8] to-[#0AA1DD]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-blue-100' : 'text-white/90'}`}>المقالات</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats?.totalArticles ?? articles.length}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-[#9333EA] to-[#7C3AED]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-purple-100' : 'text-white/90'}`}>الدروس</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats?.totalLessons ?? lessons.length}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-[#10B981] to-[#059669]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-emerald-100' : 'text-white/90'}`}>البودكاست</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats?.totalPodcasts ?? podcasts.length}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}`}>
          <div className="text-white">
            <p className={`text-sm mb-1 ${isDark ? 'text-amber-100' : 'text-white/90'}`}>الكتب</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{stats?.totalEBooks ?? ebooks.length}</h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white border-2 border-[#79DAE8]'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-[#0AA1DD]'}`}>إجمالي المشاهدات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-[#2155CD]'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats?.totalViews ?? (articles.reduce((sum, a) => sum + (a.views || 0), 0))}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div className={`p-2 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-100'} flex gap-2`}>
        {tabs.map((tab) => {
          const Icon = getTabIcon(tab);
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === tab
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'text-gray-400 hover:bg-[#0D1B1A]'
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
            >
              <Icon className="w-5 h-5" />
              {getTabLabel(tab)}
            </button>
          );
        })}
      </div>

      {/* Search and Add */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={`ابحث في ${getTabLabel(activeTab)}...`}
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
            onClick={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-[#0AA1DD] hover:bg-[#2155CD] text-white'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
          >
            <Plus className="w-5 h-5" />
            إضافة {getTabLabel(activeTab).slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          {getTabLabel(activeTab)} ({filteredData.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((item: any) => (
            <div key={item.id} className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                    {item.titleEn || item.title}
                  </h3>
                  {item.description && (
                    <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                      {item.category || 'عام'}
                    </span>
                    {item.isPublished && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        منشور
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewingItem(item)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50' : 'bg-[#79DAE8]/30 text-[#0AA1DD] hover:bg-[#79DAE8]/50'}`} title="عرض"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => setEditingItem(item)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-[#0AA1DD]/30 text-[#2155CD] hover:bg-[#0AA1DD]/50'}`} title="تعديل"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`} title="حذف"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Type-specific fields */}
              {activeTab === 'lessons' && item.duration && (
                <div className={`p-3 rounded-xl mb-3 ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'podcasts' && item.duration && (
                <div className={`p-3 rounded-xl mb-3 ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Headphones className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'articles' && (
                <div className={`grid grid-cols-2 gap-3 mb-3`}>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>المشاهدات</p>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{item.views || 0}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الإعجابات</p>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>{item.likes || 0}</p>
                  </div>
                </div>
              )}

              {activeTab === 'ebooks' && item.pages && (
                <div className={`p-3 rounded-xl mb-3 ${isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {item.pages} صفحة
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {paginatedData.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'لا توجد نتائج' : `لا توجد ${getTabLabel(activeTab)}`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <PaginationWithControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
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
      {(showAddModal || editingItem) && (
        <LibraryItemFormModal
          isDark={isDark}
          itemType={activeTab}
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={async (data) => {
            try {
              switch (activeTab) {
                case 'articles':
                  if (editingItem) {
                    await updateArticleMutation.mutateAsync({ id: editingItem.id, data });
                  } else {
                    await createArticleMutation.mutateAsync(data as CreateArticleDto);
                  }
                  break;
                case 'lessons':
                  if (editingItem) {
                    await updateLessonMutation.mutateAsync({ id: editingItem.id, data });
                  } else {
                    await createLessonMutation.mutateAsync(data as CreateLessonDto);
                  }
                  break;
                case 'podcasts':
                  if (editingItem) {
                    await updatePodcastMutation.mutateAsync({ id: editingItem.id, data });
                  } else {
                    await createPodcastMutation.mutateAsync(data as CreatePodcastDto);
                  }
                  break;
                case 'ebooks':
                  if (editingItem) {
                    await updateEBookMutation.mutateAsync({ id: editingItem.id, data });
                  } else {
                    await createEBookMutation.mutateAsync(data as CreateEBookDto);
                  }
                  break;
              }
              setShowAddModal(false);
              setEditingItem(null);
              toast.success('تم الحفظ بنجاح');
            } catch (error: any) {
              toast.error(`فشل الحفظ: ${error instanceof Error ? error.message : 'حدث خطأ ما'}`);
            }
          }}
        />
      )}

      {/* View Modal */}
      {viewingItem && (
        <ViewItemModal
          isDark={isDark}
          itemType={activeTab}
          item={viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}
    </div>
  );
}

// Form Modal Component
interface LibraryItemFormModalProps {
  isDark: boolean;
  itemType: LibraryContentType;
  item: Article | LessonType | Podcast | EBook | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

function LibraryItemFormModal({ isDark, itemType, item, onClose, onSave }: LibraryItemFormModalProps) {
  const [formData, setFormData] = useState(() => {
    if (item) return item;

    // Default values based on item type
    switch (itemType) {
      case 'articles':
        return { title: '', titleAr: '', content: '', excerpt: '', category: 'islamic-knowledge', isPublished: true };
      case 'lessons':
        return { title: '', titleAr: '', description: '', duration: 600, category: 'quran', level: 'BEGINNER', xpReward: 50 };
      case 'podcasts':
        return { title: '', titleAr: '', description: '', duration: 1800, category: 'education', xpReward: 30 };
      case 'ebooks':
        return { title: '', titleAr: '', description: '', fileUrl: '', category: 'islamic', xpReward: 100 };
      default:
        return {};
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const renderFields = () => {
    const commonFields = (
      <>
        <div>
          <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
            العنوان (عربي) *
          </label>
          <input
            type="text"
            value={formData.titleAr || formData.title || ''}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            required
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              isDark
                ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
            } outline-none`}
          />
        </div>

        <div>
          <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
            العنوان (إنجليزي)
          </label>
          <input
            type="text"
            value={formData.titleEn || ''}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              isDark
                ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
            } outline-none`}
          />
        </div>

        <div>
          <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
            التصنيف
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              isDark
                ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
            } outline-none`}
          >
            {itemType === 'articles' && (
              <>
                <option value="islamic-knowledge">معرفة إسلامية</option>
                <option value="stories">قصص</option>
                <option value="fiqh">فقه</option>
              </>
            )}
            {itemType === 'lessons' && (
              <>
                <option value="quran">قرآن</option>
                <option value="fiqh">فقه</option>
                <option value="history">تاريخ</option>
                <option value="hadeeth">حديث</option>
              </>
            )}
            {itemType === 'podcasts' && (
              <>
                <option value="education">تعليم</option>
                <option value="stories">قصص</option>
                <option value="lectures">محاضرات</option>
              </>
            )}
            {itemType === 'ebooks' && (
              <>
                <option value="islamic">إسلامي</option>
                <option value="history">تاريخ</option>
                <option value="fiqh">فقه</option>
              </>
            )}
          </select>
        </div>
      </>
    );

    switch (itemType) {
      case 'articles':
        return (
          <>
            {commonFields}
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                المحتوى *
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                مقتطف
              </label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الصورة
              </label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                المؤلف
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
          </>
        );

      case 'lessons':
        return (
          <>
            {commonFields}
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                الوصف
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                المستوى
              </label>
              <select
                value={formData.level || 'BEGINNER'}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              >
                <option value="BEGINNER">مبتدئ</option>
                <option value="INTERMEDIATE">متوسط</option>
                <option value="ADVANCED">متقدم</option>
              </select>
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الفيديو
              </label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الصورة المصغرة
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl || ''}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  المدة (ثانية)
                </label>
                <input
                  type="number"
                  value={formData.duration || 0}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  مكافأة XP
                </label>
                <input
                  type="number"
                  value={formData.xpReward || 50}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
            </div>
          </>
        );

      case 'podcasts':
        return (
          <>
            {commonFields}
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                الوصف
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                المقدم/المتحدث
              </label>
              <input
                type="text"
                value={formData.speaker || ''}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الصوت
              </label>
              <input
                type="url"
                value={formData.audioUrl || ''}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الصورة
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl || ''}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  المدة (ثانية)
                </label>
                <input
                  type="number"
                  value={formData.duration || 0}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  مكافأة XP
                </label>
                <input
                  type="number"
                  value={formData.xpReward || 30}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
            </div>
          </>
        );

      case 'ebooks':
        return (
          <>
            {commonFields}
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                الوصف
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط الملف (PDF)
              </label>
              <input
                type="url"
                value={formData.fileUrl || ''}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                رابط صورة الغلاف
              </label>
              <input
                type="url"
                value={formData.coverUrl || ''}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  المؤلف
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
              <div>
                <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                  عدد الصفحات
                </label>
                <input
                  type="number"
                  value={formData.pages || 0}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                />
              </div>
            </div>
            <div>
              <label className={`block mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                مكافأة XP
              </label>
              <input
                type="number"
                value={formData.xpReward || 100}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                } outline-none`}
              />
            </div>
          </>
        );

      default:
        return null;
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
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'border-[#2a5a4d] bg-[#1A2C2B]' : 'border-gray-200 bg-white'} z-10`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {item ? 'تعديل' : 'إضافة'} {getTabLabel(itemType).slice(0, -1)}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {renderFields()}

          {/* Actions */}
          <div className="flex gap-3 sticky bottom-0 bg-inherit pt-4 border-t" style={{ borderColor: isDark ? '#2a5a4d' : '#e5e5e5' }}>
            <button
              type="submit"
              className="flex-1 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all"
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              {item ? 'حفظ التعديلات' : 'إضافة'}
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

// Helper function
function getTabLabel(tab: LibraryContentType): string {
  switch (tab) {
    case 'articles': return 'المقالات';
    case 'lessons': return 'الدروس';
    case 'podcasts': return 'البودكاست';
    case 'ebooks': return 'الكتب';
  }
}

// View Item Modal
interface ViewItemModalProps {
  isDark: boolean;
  itemType: LibraryContentType;
  item: Article | LessonType | Podcast | EBook;
  onClose: () => void;
}

function ViewItemModal({ isDark, itemType, item, onClose }: ViewItemModalProps) {
  const getDetails = () => {
    const details: Array<{ label: string; value: string | number }> = [];

    details.push({ label: 'العنوان', value: item.titleEn || item.title });

    if (item.description) {
      details.push({ label: 'الوصف', value: item.description });
    }

    details.push({ label: 'التصنيف', value: item.category || '-' });

    if (itemType === 'lessons' || itemType === 'podcasts') {
      const duration = (item as LessonType | Podcast).duration;
      details.push({ label: 'المدة', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` });
    }

    if (itemType === 'lessons' || itemType === 'podcasts' || itemType === 'ebooks') {
      details.push({ label: 'مكافأة XP', value: (item as LessonType | Podcast | EBook).xpReward?.toString() || '0' });
    }

    if (itemType === 'ebooks') {
      const ebook = item as EBook;
      if (ebook.author) details.push({ label: 'المؤلف', value: ebook.author });
      if (ebook.pages) details.push({ label: 'الصفحات', value: ebook.pages });
    }

    if (itemType === 'podcasts') {
      const podcast = item as Podcast;
      if (podcast.speaker) details.push({ label: 'المقدم', value: podcast.speaker });
    }

    if (itemType === 'articles') {
      const article = item as Article;
      if (article.author) details.push({ label: 'المؤلف', value: article.author });
      details.push({ label: 'المشاهدات', value: article.views?.toString() || '0' });
      details.push({ label: 'الإعجابات', value: article.likes?.toString() || '0' });
    }

    return details;
  };

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
              {getTabLabel(itemType).slice(0, -1)} - {item.titleEn || item.title}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {getDetails().map((detail, index) => (
            <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                {detail.label}
              </p>
              <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                {detail.value}
              </p>
            </div>
          ))}

          {itemType === 'articles' && (item as Article).content && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A2C2B]' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: "'Cairo', sans-serif" }}>
                المحتوى
              </p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                {(item as Article).content}
              </p>
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
