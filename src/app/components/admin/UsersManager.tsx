import { useState, useMemo, useCallback } from 'react';
import { Search, Crown, Award, TrendingUp, Ban, CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';
import { useUsers, useUpdateUserStatus, useDeleteUser } from '../../../hooks/useUsers';
import { PaginationWithControls } from './PaginationWithControls';
import { StyledSelect } from './StyledSelect';
import type { User, UserStatus } from '../../../types/users';

interface UsersManagerProps {
  isDark: boolean;
}

// Arabic status mapping
const STATUS_AR: Record<UserStatus, 'نشط' | 'محظور'> = {
  ACTIVE: 'نشط',
  BANNED: 'محظور',
};

const STATUS_OPTIONS: Array<{ value: UserStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'الكل' },
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'BANNED', label: 'محظور' },
];

export function UsersManager({ isDark }: UsersManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'accuracy' | 'streak'>('xp');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users from API
  const { data: users = [], isLoading, error, refetch } = useUsers();

  // Mutations
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  // Filter and sort users on client side (could be moved to server)
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter by status
    if (selectedStatus !== 'ALL') {
      result = result.filter(u => u.status === selectedStatus);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'xp': return b.xp - a.xp;
        case 'level': return b.level - a.level;
        case 'accuracy': return b.accuracy - a.accuracy;
        case 'streak': return b.streak - a.streak;
        default: return 0;
      }
    });

    return result;
  }, [users, selectedStatus, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, sortBy]);

  const toggleUserStatus = async (user: User) => {
    const newStatus: UserStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    try {
      await updateUserStatusMutation.mutateAsync({
        id: user.id,
        status: newStatus,
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
      // Error is handled by the mutation's onError
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟`)) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (users.length === 0) {
      return { active: 0, banned: 0, avgXP: 0, avgAccuracy: 0 };
    }

    const active = users.filter(u => u.status === 'ACTIVE').length;
    const banned = users.filter(u => u.status === 'BANNED').length;
    const avgXP = Math.round(users.reduce((sum, u) => sum + (u.xp || 0), 0) / users.length);
    const avgAccuracy = users.length > 0
      ? Math.round(users.reduce((sum, u) => sum + (u.accuracy || 0), 0) / users.length)
      : 0;

    return { active, banned, avgXP, avgAccuracy };
  }, [users]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`p-12 rounded-2xl flex flex-col items-center justify-center ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          جاري تحميل المستخدمين...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-12 rounded-2xl flex flex-col items-center justify-center ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          فشل تحميل المستخدمين
        </p>
        <button
          onClick={() => refetch()}
          className={`px-6 py-2 rounded-xl ${
            isDark
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-[#79DAE8] to-[#0AA1DD]'
        }`}>
          <div className="text-white">
            <p className="text-emerald-100 text-sm mb-1">المستخدمون النشطون</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.active}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-red-400 to-red-600'
        }`}>
          <div className="text-white">
            <p className="text-red-100 text-sm mb-1">المحظورون</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.banned}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-blue-400 to-blue-600'
        }`}>
          <div className="text-white">
            <p className="text-blue-100 text-sm mb-1">متوسط XP</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.avgXP.toLocaleString('ar-SA')}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-purple-400 to-purple-600'
        }`}>
          <div className="text-white">
            <p className="text-purple-100 text-sm mb-1">متوسط الدقة</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.avgAccuracy}%
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white placeholder-gray-500 focus:border-emerald-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
              } outline-none`}
            />
          </div>

          {/* Status Filter */}
          <StyledSelect
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as UserStatus | 'ALL')}
            options={STATUS_OPTIONS.map(status => ({ value: status.value, label: status.label }))}
            isDark={isDark}
          />

          {/* Sort By */}
          <StyledSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'xp', label: 'الترتيب حسب XP' },
              { value: 'level', label: 'الترتيب حسب المستوى' },
              { value: 'accuracy', label: 'الترتيب حسب الدقة' },
              { value: 'streak', label: 'الترتيب حسب السلسلة' },
            ]}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          المستخدمون ({filteredUsers.length})
        </h3>

        {paginatedUsers.map((user, index) => {
          const statusAr = STATUS_AR[user.status];
          const isPending = updateUserStatusMutation.isPending ||
            (deleteUserMutation.isPending && updateUserStatusMutation.variables?.id === user.id);

          return (
            <div
              key={user.id}
              className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl relative ${
                isDark ? 'bg-[#1A2C2B]' : 'bg-white'
              } ${isPending ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  index === 0
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                    : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                      : index === 2
                        ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                        : isDark ? 'bg-[#0D1B1A]' : 'bg-gray-100'
                }`}>
                  <span className={`text-xl ${index < 3 ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                    #{index + 1}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                          {user.name}
                        </h4>
                        {index < 3 && (
                          <Crown className={`w-5 h-5 ${
                            index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : 'text-orange-500'
                          }`} />
                        )}
                        {user.role === 'ADMIN' && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                          }`}>
                            مشرف
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          user.status === 'ACTIVE'
                            ? isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                            : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                        }`}>
                          {statusAr}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          انضم في {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        disabled={isPending}
                        className={`px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.status === 'ACTIVE'
                            ? isDark
                              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                            : isDark
                              ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                              : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        }`}
                        style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                      >
                        {user.status === 'ACTIVE' ? (
                          <><Ban className="w-4 h-4 inline ml-1" />حظر</>
                        ) : (
                          <><CheckCircle className="w-4 h-4 inline ml-1" />تفعيل</>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={isPending || user.role === 'ADMIN'}
                        className={`px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark
                            ? 'bg-gray-900/30 text-gray-400 hover:bg-gray-900/50'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
                        title={user.role === 'ADMIN' ? 'لا يمكن حذف المشرفين' : 'حذف المستخدم'}
                      >
                        <X className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className={`grid grid-cols-2 md:grid-cols-6 gap-4 p-4 rounded-xl ${
                    isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>المستوى</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {user.level}
                      </p>
                    </div>

                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>XP</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {user.xp.toLocaleString('ar-SA')}
                      </p>
                    </div>

                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الدقة</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {isNaN(user.accuracy) || user.accuracy === null || user.accuracy === undefined ? '0' : Math.round(user.accuracy)}%
                      </p>
                    </div>

                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>السلسلة</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {user.streak} 🔥
                      </p>
                    </div>

                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الأسئلة</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {user.questionsAnswered}
                      </p>
                    </div>

                    <div>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الدور</p>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                        {user.role === 'ADMIN' ? 'مشرف' : 'مستخدم'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {paginatedUsers.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-white'
          }`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredUsers.length === 0 ? 'لا يوجد مستخدمون' : 'لا يوجد مستخدمون في هذه الصفحة'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <PaginationWithControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
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
    </div>
  );
}