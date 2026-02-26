import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Film, Image, Music, Eye, EyeOff, X, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  useReels,
  useCreateReel,
  useUpdateReel,
  useDeleteReel,
  getReelStatus,
} from '../../../hooks';
import { StyledSelect } from './StyledSelect';
import type { CreateReelDto, UpdateReelDto, MediaType, ReelStatus } from '../../../types/reels';

interface ReelsManagerProps {
  isDark: boolean;
}

export function ReelsManager({ isDark }: ReelsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [reelForm, setReelForm] = useState<CreateReelDto & { id?: string }>({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'IMAGE',
    xpReward: 0,
    isActive: true,
    expiresAt: '',
  });

  // Fetch data
  const { data: reels = [], isLoading, error, refetch } = useReels();

  // Mutations
  const createReelMutation = useCreateReel();
  const updateReelMutation = useUpdateReel();
  const deleteReelMutation = useDeleteReel();

  // Filter reels
  const filteredReels = useMemo(() => {
    let result = reels.map(reel => ({
      ...reel,
      status: getReelStatus(reel),
    }));

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (mediaTypeFilter !== 'all') {
      result = result.filter(r => r.mediaType === mediaTypeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        (r.description && r.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [reels, searchQuery, statusFilter, mediaTypeFilter]);

  // Handlers
  const openAddModal = () => {
    setReelForm({
      title: '',
      description: '',
      mediaUrl: '',
      mediaType: 'IMAGE',
      xpReward: 0,
      isActive: true,
      expiresAt: '',
    });
    setShowAddModal(true);
  };

  const openEditModal = (reel: any) => {
    setReelForm({
      id: reel.id,
      title: reel.title,
      description: reel.description || '',
      mediaUrl: reel.mediaUrl || '',
      mediaType: reel.mediaType,
      xpReward: reel.xpReward,
      isActive: reel.isActive,
      expiresAt: reel.expiresAt ? new Date(reel.expiresAt).toISOString().slice(0, 16) : '',
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!reelForm.title) {
      toast.error('يرجى إدخال عنوان الفيديو');
      return;
    }

    try {
      const data: CreateReelDto | UpdateReelDto = {
        title: reelForm.title,
        description: reelForm.description,
        mediaUrl: reelForm.mediaUrl,
        mediaType: reelForm.mediaType,
        xpReward: reelForm.xpReward,
        isActive: reelForm.isActive,
        expiresAt: reelForm.expiresAt || undefined,
      };

      if (reelForm.id) {
        await updateReelMutation.mutateAsync({
          id: reelForm.id,
          data,
        });
        toast.success('تم تحديث الفيديو بنجاح');
      } else {
        await createReelMutation.mutateAsync(data);
        toast.success('تم إضافة الفيديو بنجاح');
      }

      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to save reel:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;

    try {
      await deleteReelMutation.mutateAsync(id);
      toast.success('تم حذف الفيديو بنجاح');
    } catch (error) {
      console.error('Failed to delete reel:', error);
    }
  };

  const getStatusBadge = (status: ReelStatus) => {
    const badges = {
      active: { label: 'نشط', color: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700' },
      expired: { label: 'منتهي', color: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700' },
      inactive: { label: 'معطل', color: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600' },
    };
    return badges[status];
  };

  const getMediaTypeIcon = (type: MediaType) => {
    const icons = {
      IMAGE: Image,
      VIDEO: Film,
      AUDIO: Music,
    };
    return icons[type] || Film;
  };

  const getMediaTypeBadge = (type: MediaType) => {
    const badges = {
      IMAGE: { label: 'صورة', color: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' },
      VIDEO: { label: 'فيديو', color: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700' },
      AUDIO: { label: 'صوت', color: isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-700' },
    };
    return badges[type];
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل الفيديوهات...
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
    { value: 'active', label: 'نشط' },
    { value: 'expired', label: 'منتهي' },
    { value: 'inactive', label: 'معطل' },
  ];

  const mediaTypeOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'IMAGE', label: 'صور' },
    { value: 'VIDEO', label: 'فيديوهات' },
    { value: 'AUDIO', label: 'صوتيات' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'}`}>
              <Film className={`w-8 h-8 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                الفيديوهات
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                إدارة محتوى الفيديوهات والصور التعليمية
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
              placeholder="ابحث عن فيديو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-12 pl-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
              }`}
            />
          </div>

          <StyledSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            isDark={isDark}
          />

          <StyledSelect
            value={mediaTypeFilter}
            onChange={setMediaTypeFilter}
            options={mediaTypeOptions}
            isDark={isDark}
          />

          <button
            onClick={openAddModal}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
              isDark ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة فيديو</span>
          </button>
        </div>
      </div>

      {/* Reels List */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        {filteredReels.length === 0 ? (
          <div className="text-center py-12">
            <Film className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-cairo-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery || statusFilter !== 'all' || mediaTypeFilter !== 'all'
                ? 'لا توجد نتائج'
                : 'لا توجد فيديوهات حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReels.map((reel) => {
              const statusBadge = getStatusBadge(reel.status);
              const mediaTypeBadge = getMediaTypeBadge(reel.mediaType);
              const MediaTypeIcon = getMediaTypeIcon(reel.mediaType);

              return (
                <div
                  key={reel.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-pink-500/50' : 'bg-white border-gray-200 hover:border-pink-300'
                  }`}
                >
                  {/* Media Preview */}
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                    {reel.mediaUrl ? (
                      reel.mediaType === 'IMAGE' ? (
                        <img
                          src={reel.mediaUrl}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ccc"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666"%3Eلا توجد صورة%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <video
                          src={reel.mediaUrl}
                          className="w-full h-full object-cover"
                          controls={false}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MediaTypeIcon className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    )}

                    {/* Status Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className={`px-2 py-1 rounded-lg text-xs font-cairo-semibold ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-cairo-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {reel.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-cairo-medium ${mediaTypeBadge.color}`}>
                            {mediaTypeBadge.label}
                          </span>
                          {reel.isActive ? (
                            <Eye className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          ) : (
                            <EyeOff className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(reel)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isDark ? 'hover:bg-pink-900/30 text-pink-400' : 'hover:bg-pink-100 text-pink-600'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reel.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {reel.description && (
                      <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {reel.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Eye className="w-3 h-3" />
                          {formatNumber(reel.views)}
                        </span>
                        {reel.xpReward > 0 && (
                          <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {reel.xpReward} XP
                          </span>
                        )}
                      </div>

                      {reel.expiresAt && (
                        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <Clock className="w-3 h-3" />
                          {formatDate(reel.expiresAt)}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    {reel.user && (
                      <div className={`mt-2 pt-2 border-t text-xs ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                        بواسطة: {reel.user.name || reel.user.username || 'مستخدم'}
                      </div>
                    )}
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
          <div className={`rounded-2xl shadow-2xl w-full max-w-md ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {reelForm.id ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    العنوان *
                  </label>
                  <input
                    type="text"
                    value={reelForm.title}
                    onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
                    }`}
                    placeholder="مثال: درس مهم في التوحيد"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    الوصف
                  </label>
                  <textarea
                    value={reelForm.description}
                    onChange={(e) => setReelForm({ ...reelForm, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
                    }`}
                    rows={3}
                    placeholder="وصف الفيديو..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    رابط الميديا
                  </label>
                  <input
                    type="url"
                    value={reelForm.mediaUrl}
                    onChange={(e) => setReelForm({ ...reelForm, mediaUrl: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
                    }`}
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    اتركه فارغاً إذا أردت رفعه لاحقاً
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      نوع الميديا
                    </label>
                    <StyledSelect
                      value={reelForm.mediaType}
                      onChange={(value) => setReelForm({ ...reelForm, mediaType: value as MediaType })}
                      options={[
                        { value: 'IMAGE', label: 'صورة' },
                        { value: 'VIDEO', label: 'فيديو' },
                        { value: 'AUDIO', label: 'صوت' },
                      ]}
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      مكافأة XP
                    </label>
                    <input
                      type="number"
                      value={reelForm.xpReward}
                      onChange={(e) => setReelForm({ ...reelForm, xpReward: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        isDark
                          ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    تاريخ انتهاء الصلاحية
                  </label>
                  <input
                    type="datetime-local"
                    value={reelForm.expiresAt}
                    onChange={(e) => setReelForm({ ...reelForm, expiresAt: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      isDark
                        ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-pink-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    اتركه فارغاً لعدم انتهاء الصلاحية
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl" style={{
                  backgroundColor: isDark ? '#0D1B1A' : '#f9fafb',
                  border: `2px solid ${isDark ? '#2a5a4d' : '#e5e5e5'}`
                }}>
                  <span className={`text-sm font-cairo-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    حالة النشاط
                  </span>
                  <button
                    type="button"
                    onClick={() => setReelForm({ ...reelForm, isActive: !reelForm.isActive })}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      reelForm.isActive
                        ? isDark
                          ? 'bg-emerald-600'
                          : 'bg-emerald-500'
                        : isDark
                          ? 'bg-gray-700'
                          : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 ${reelForm.isActive ? 'right-1' : 'left-1'} w-4 h-4 rounded-full bg-white transition-all`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={createReelMutation.isPending || updateReelMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                    isDark ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-pink-500 text-white hover:bg-pink-600'
                  } ${(createReelMutation.isPending || updateReelMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {(createReelMutation.isPending || updateReelMutation.isPending) ? (
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
                  disabled={createReelMutation.isPending || updateReelMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${(createReelMutation.isPending || updateReelMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
