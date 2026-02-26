import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Award, Target, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useBadges,
  useAchievements,
  useCreateBadge,
  useUpdateBadge,
  useDeleteBadge,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from '../../../hooks';
import { StyledSelect } from './StyledSelect';
import type { Badge, Achievement, CreateBadgeDto, UpdateBadgeDto, CreateAchievementDto, UpdateAchievementDto, BadgeCategory, AchievementType } from '../../../types/badges';

interface BadgesManagerProps {
  isDark: boolean;
}

type TabType = 'badges' | 'achievements';

export function BadgesManager({ isDark }: BadgesManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('badges');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Badge | Achievement | null>(null);

  // Badges state
  const [badgeForm, setBadgeForm] = useState<CreateBadgeDto & { id?: string }>({
    name: '',
    nameAr: '',
    description: '',
    icon: '🏆',
    xpReward: 0,
    category: 'GENERAL',
  });

  // Achievements state
  const [achievementForm, setAchievementForm] = useState<CreateAchievementDto & { id?: string }>({
    title: '',
    titleAr: '',
    description: '',
    icon: '🎯',
    type: 'DAILY',
    xpReward: 0,
    targetValue: 1,
    category: '',
  });

  // Fetch data
  const { data: badges = [], isLoading: badgesLoading, error: badgesError } = useBadges(
    selectedCategory !== 'all' ? selectedCategory : undefined
  );
  const { data: achievements = [], isLoading: achievementsLoading, error: achievementsError } = useAchievements();

  // Mutations
  const createBadgeMutation = useCreateBadge();
  const updateBadgeMutation = useUpdateBadge();
  const deleteBadgeMutation = useDeleteBadge();
  const createAchievementMutation = useCreateAchievement();
  const updateAchievementMutation = useUpdateAchievement();
  const deleteAchievementMutation = useDeleteAchievement();

  // Filter data
  const filteredBadges = useMemo(() => {
    if (!searchQuery) return badges;
    const query = searchQuery.toLowerCase();
    return badges.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.nameAr.toLowerCase().includes(query) ||
      (b.description && b.description.toLowerCase().includes(query))
    );
  }, [badges, searchQuery]);

  const filteredAchievements = useMemo(() => {
    if (!searchQuery) return achievements;
    const query = searchQuery.toLowerCase();
    return achievements.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.titleAr.toLowerCase().includes(query) ||
      (a.description && a.description.toLowerCase().includes(query))
    );
  }, [achievements, searchQuery]);

  // Handlers
  const openAddModal = () => {
    setEditingItem(null);
    if (activeTab === 'badges') {
      setBadgeForm({
        name: '',
        nameAr: '',
        description: '',
        icon: '🏆',
        xpReward: 0,
        category: 'GENERAL',
      });
    } else {
      setAchievementForm({
        title: '',
        titleAr: '',
        description: '',
        icon: '🎯',
        type: 'DAILY',
        xpReward: 0,
        targetValue: 1,
        category: '',
      });
    }
    setShowAddModal(true);
  };

  const openEditModal = (item: Badge | Achievement) => {
    setEditingItem(item);
    if (activeTab === 'badges') {
      const badge = item as Badge;
      setBadgeForm({
        id: badge.id,
        name: badge.name,
        nameAr: badge.nameAr,
        description: badge.description || '',
        icon: badge.icon || '🏆',
        xpReward: badge.xpReward,
        category: badge.category,
      });
    } else {
      const achievement = item as Achievement;
      setAchievementForm({
        id: achievement.id,
        title: achievement.title,
        titleAr: achievement.titleAr,
        description: achievement.description || '',
        icon: achievement.icon || '🎯',
        type: achievement.type,
        xpReward: achievement.xpReward,
        targetValue: achievement.targetValue,
        category: achievement.category || '',
      });
    }
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'badges') {
        if (editingItem) {
          await updateBadgeMutation.mutateAsync({
            id: badgeForm.id!,
            data: {
              name: badgeForm.name,
              nameAr: badgeForm.nameAr,
              description: badgeForm.description,
              icon: badgeForm.icon,
              xpReward: badgeForm.xpReward,
              category: badgeForm.category,
            },
          });
          toast.success('تم تحديث الشارة بنجاح');
        } else {
          await createBadgeMutation.mutateAsync({
            name: badgeForm.name,
            nameAr: badgeForm.nameAr,
            description: badgeForm.description,
            icon: badgeForm.icon,
            xpReward: badgeForm.xpReward,
            category: badgeForm.category,
          });
          toast.success('تم إضافة الشارة بنجاح');
        }
      } else {
        if (editingItem) {
          await updateAchievementMutation.mutateAsync({
            id: achievementForm.id!,
            data: {
              title: achievementForm.title,
              titleAr: achievementForm.titleAr,
              description: achievementForm.description,
              icon: achievementForm.icon,
              type: achievementForm.type,
              xpReward: achievementForm.xpReward,
              targetValue: achievementForm.targetValue,
              category: achievementForm.category,
            },
          });
          toast.success('تم تحديث الإنجاز بنجاح');
        } else {
          await createAchievementMutation.mutateAsync({
            title: achievementForm.title,
            titleAr: achievementForm.titleAr,
            description: achievementForm.description,
            icon: achievementForm.icon,
            type: achievementForm.type,
            xpReward: achievementForm.xpReward,
            targetValue: achievementForm.targetValue,
            category: achievementForm.category,
          });
          toast.success('تم إضافة الإنجاز بنجاح');
        }
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      if (activeTab === 'badges') {
        await deleteBadgeMutation.mutateAsync(id);
        toast.success('تم حذف الشارة بنجاح');
      } else {
        await deleteAchievementMutation.mutateAsync(id);
        toast.success('تم حذف الإنجاز بنجاح');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      GENERAL: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
      QUIZ: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700',
      LEARNING: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
      STREAK: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700',
      SOCIAL: isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-700',
      CONTEST: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
    };
    return colors[category] || colors.GENERAL;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DAILY: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
      WEEKLY: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700',
      MONTHLY: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
      'ONE_TIME': isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700',
    };
    return colors[type] || colors.DAILY;
  };

  const isLoading = activeTab === 'badges' ? badgesLoading : achievementsLoading;
  const error = activeTab === 'badges' ? badgesError : achievementsError;
  const filteredData = activeTab === 'badges' ? filteredBadges : filteredAchievements;

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
        <p className={`text-red-500 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل البيانات
        </p>
      </div>
    );
  }

  const badgeCategories: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'الكل' },
    { value: 'GENERAL', label: 'عام' },
    { value: 'QUIZ', label: 'اختبارات' },
    { value: 'LEARNING', label: 'تعلم' },
    { value: 'STREAK', label: 'سلسلة' },
    { value: 'SOCIAL', label: 'اجتماعي' },
    { value: 'CONTEST', label: 'مسابقات' },
  ];

  const achievementTypes: Array<{ value: AchievementType; label: string }> = [
    { value: 'DAILY', label: 'يومي' },
    { value: 'WEEKLY', label: 'أسبوعي' },
    { value: 'MONTHLY', label: 'شهري' },
    { value: 'ONE_TIME', label: 'مرة واحدة' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Award className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                الشارات والإنجازات
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                إدارة شارات وإنجازات المستخدمين
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
              activeTab === 'badges'
                ? isDark
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            الشارات ({badges.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
              activeTab === 'achievements'
                ? isDark
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            الإنجازات ({achievements.length})
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={activeTab === 'badges' ? 'ابحث عن شارة...' : 'ابحث عن إنجاز...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-12 pl-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDark
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
              }`}
            />
          </div>

          {activeTab === 'badges' && (
            <StyledSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={badgeCategories}
              isDark={isDark}
            />
          )}

          <button
            onClick={openAddModal}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cairo-semibold transition-all ${
              isDark ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>{activeTab === 'badges' ? 'إضافة شارة' : 'إضافة إنجاز'}</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className={`p-6 rounded-2xl shadow-lg ${isDark ? 'bg-[#1A2C2B]' : 'bg-white'}`}>
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-cairo-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'لا توجد نتائج للبحث' : activeTab === 'badges' ? 'لا توجد شارات حالياً' : 'لا توجد إنجازات حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => {
              const isBadge = activeTab === 'badges';
              const badge = item as Badge;
              const achievement = item as Achievement;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isDark ? 'bg-[#0D1B1A] border-[#2a5a4d] hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                      }`}>
                        {isBadge ? badge.icon || '🏆' : achievement.icon || '🎯'}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-cairo-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {isBadge ? badge.nameAr || badge.name : achievement.titleAr}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isBadge ? badge.name : achievement.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark ? 'hover:bg-purple-900/30 text-purple-400' : 'hover:bg-purple-100 text-purple-600'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isBadge ? (
                    <>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {badge.description || 'لا يوجد وصف'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(badge.category)}`}>
                          {badge.category}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {badge.xpReward} XP
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {achievement.description || 'لا يوجد وصف'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(achievement.type)}`}>
                          {achievement.type}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          الهدف: {achievement.targetValue}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {achievement.xpReward} XP
                        </span>
                      </div>
                    </>
                  )}

                  {item._count?.users !== undefined && (
                    <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item._count.users} مستخدم حصل على {isBadge ? 'الشارة' : 'الإنجاز'}
                      </span>
                    </div>
                  )}
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
                  {editingItem ? (activeTab === 'badges' ? 'تعديل الشارة' : 'تعديل الإنجاز') : (activeTab === 'badges' ? 'إضافة شارة جديدة' : 'إضافة إنجاز جديد')}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#0D1B1A]' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {activeTab === 'badges' ? (
                  <>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        اسم الشارة (عربي) *
                      </label>
                      <input
                        type="text"
                        value={badgeForm.nameAr}
                        onChange={(e) => setBadgeForm({ ...badgeForm, nameAr: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="مثال: بطل الأسئلة"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        اسم الشارة (إنجليزي) *
                      </label>
                      <input
                        type="text"
                        value={badgeForm.name}
                        onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="Quiz Champion"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        الوصف
                      </label>
                      <textarea
                        value={badgeForm.description}
                        onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        rows={3}
                        placeholder="وصف الشارة..."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        الأيقونة (إيموجي)
                      </label>
                      <input
                        type="text"
                        value={badgeForm.icon}
                        onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-center text-2xl ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="🏆"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          مكافأة XP
                        </label>
                        <input
                          type="number"
                          value={badgeForm.xpReward}
                          onChange={(e) => setBadgeForm({ ...badgeForm, xpReward: parseInt(e.target.value) || 0 })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            isDark
                              ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                          }`}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          الفئة
                        </label>
                        <StyledSelect
                          value={badgeForm.category}
                          onChange={(value) => setBadgeForm({ ...badgeForm, category: value as BadgeCategory })}
                          options={[
                            { value: 'GENERAL', label: 'عام' },
                            { value: 'QUIZ', label: 'اختبارات' },
                            { value: 'LEARNING', label: 'تعلم' },
                            { value: 'STREAK', label: 'سلسلة' },
                            { value: 'SOCIAL', label: 'اجتماعي' },
                            { value: 'CONTEST', label: 'مسابقات' },
                          ]}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        اسم الإنجاز (عربي) *
                      </label>
                      <input
                        type="text"
                        value={achievementForm.titleAr}
                        onChange={(e) => setAchievementForm({ ...achievementForm, titleAr: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="مثال: استمر لمدة أسبوع"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        اسم الإنجاز (إنجليزي) *
                      </label>
                      <input
                        type="text"
                        value={achievementForm.title}
                        onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="Week Streak"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        الوصف
                      </label>
                      <textarea
                        value={achievementForm.description}
                        onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        rows={3}
                        placeholder="وصف الإنجاز..."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        الأيقونة (إيموجي)
                      </label>
                      <input
                        type="text"
                        value={achievementForm.icon}
                        onChange={(e) => setAchievementForm({ ...achievementForm, icon: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-center text-2xl ${
                          isDark
                            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="🎯"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          النوع
                        </label>
                        <StyledSelect
                          value={achievementForm.type}
                          onChange={(value) => setAchievementForm({ ...achievementForm, type: value as AchievementType })}
                          options={achievementTypes}
                          isDark={isDark}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          قيمة الهدف
                        </label>
                        <input
                          type="number"
                          value={achievementForm.targetValue}
                          onChange={(e) => setAchievementForm({ ...achievementForm, targetValue: parseInt(e.target.value) || 1 })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            isDark
                              ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                          }`}
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          مكافأة XP
                        </label>
                        <input
                          type="number"
                          value={achievementForm.xpReward}
                          onChange={(e) => setAchievementForm({ ...achievementForm, xpReward: parseInt(e.target.value) || 0 })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            isDark
                              ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                          }`}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-cairo-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          الفئة (اختياري)
                        </label>
                        <input
                          type="text"
                          value={achievementForm.category}
                          onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            isDark
                              ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-purple-500'
                              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'
                          }`}
                          placeholder="QUIZ"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={activeTab === 'badges' ? createBadgeMutation.isPending || updateBadgeMutation.isPending : createAchievementMutation.isPending || updateAchievementMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold flex items-center justify-center gap-2 ${
                    isDark ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'
                  } ${(activeTab === 'badges' ? (createBadgeMutation.isPending || updateBadgeMutation.isPending) : (createAchievementMutation.isPending || updateAchievementMutation.isPending)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {(activeTab === 'badges' ? (createBadgeMutation.isPending || updateBadgeMutation.isPending) : (createAchievementMutation.isPending || updateAchievementMutation.isPending)) ? (
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
                  disabled={activeTab === 'badges' ? createBadgeMutation.isPending || updateBadgeMutation.isPending : createAchievementMutation.isPending || updateAchievementMutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-cairo-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${(activeTab === 'badges' ? (createBadgeMutation.isPending || updateBadgeMutation.isPending) : (createAchievementMutation.isPending || updateAchievementMutation.isPending)) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
