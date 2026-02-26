# Dashboard Implementation Plan

## ✅ COMPLETED

### 1. Critical Bug Fix - useCategories Hook
- **Status:** ✅ DONE
- **File:** `src/hooks/useCategories.ts`
- **Description:** Created `useCategories` hook that aliases `useCourses`
- **Impact:** QuestionsPage now loads without crashing

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Complete Existing Pages (High Priority)

#### 1.1 Library Page - Connect to Real API
**Status:** ⚠️ IN PROGRESS
**Current Issue:** Uses mock/local state data

**Tasks:**
- [ ] Create `src/api/library.ts` with API functions:
  ```
  - getArticles(category?, page?, limit?)
  - getArticle(id)
  - createArticle(data)
  - updateArticle(id, data)
  - deleteArticle(id)
  - getLessons(category?, level?, page?, limit?)
  - getLesson(id)
  - createLesson(data)
  - updateLesson(id, data)
  - deleteLesson(id)
  - getPodcasts(category?, page?, limit?)
  - getPodcast(id)
  - createPodcast(data)
  - updatePodcast(id, data)
  - deletePodcast(id)
  - getEBooks(category?, page?, limit?)
  - getEBook(id)
  - createEBook(data)
  - updateEBook(id, data)
  - deleteEBook(id)
  ```

- [ ] Create `src/hooks/useLibrary.ts` with React Query hooks
- [ ] Create `src/types/library.ts` with TypeScript interfaces
- [ ] Update `LibraryManager.tsx` to use real API instead of mock data
- [ ] Add image upload functionality for content thumbnails

**Files to Create:**
- `src/api/library.ts`
- `src/hooks/useLibrary.ts`
- `src/types/library.ts`

**Files to Modify:**
- `src/app/components/admin/LibraryManager.tsx`

---

#### 1.2 Hierarchical View - Stage/Level Management
**Status:** ❌ NOT STARTED
**Current Issue:** Implementation unclear

**Tasks:**
- [ ] Create `src/api/stages.ts` with API functions
- [ ] Create `src/api/levels.ts` with API functions
- [ ] Create `src/hooks/useStages.ts`
- [ ] Create `src/hooks/useLevels.ts`
- [ ] Create `src/types/stages.ts`
- [ ] Create `src/types/levels.ts`
- [ ] Implement `HierarchicalView.tsx` with:
  - Tree view of Categories → Stages → Levels
  - Drag-and-drop for reordering
  - CRUD operations for stages and levels
  - Visual hierarchy display

**Files to Create:**
- `src/api/stages.ts`
- `src/api/levels.ts`
- `src/hooks/useStages.ts`
- `src/hooks/useLevels.ts`
- `src/types/stages.ts`
- `src/types/levels.ts`

**Files to Modify:**
- `src/app/components/admin/HierarchicalView.tsx`

---

### Phase 2: Add New Management Pages (Medium Priority)

#### 2.1 Badges Management Page
**Status:** ❌ NOT STARTED
**API Endpoint:** `/api/badges`

**Tasks:**
- [ ] Create `src/api/badges.ts`
- [ ] Create `src/hooks/useBadges.ts`
- [ ] Create `src/types/badges.ts`
- [ ] Create `src/app/pages/BadgesPage.tsx`
- [ ] Create `src/app/components/admin/BadgesManager.tsx`
- [ ] Features:
  - List all badges with icon preview
  - Create/edit badges with Arabic name
  - Set XP rewards
  - Assign badges to achievements
  - Badge categories (GENERAL, STREAK, ACHIEVEMENT, SPECIAL)

**Files to Create:**
- `src/api/badges.ts`
- `src/hooks/useBadges.ts`
- `src/types/badges.ts`
- `src/app/pages/BadgesPage.tsx`
- `src/app/components/admin/BadgesManager.tsx`

**Files to Modify:**
- `src/app/App.tsx` (add route)

---

#### 2.2 Achievements Management Page
**Status:** ❌ NOT STARTED
**API Endpoint:** `/api/achievements`

**Tasks:**
- [ ] Create `src/api/achievements.ts`
- [ ] Create `src/hooks/useAchievements.ts`
- [ ] Create `src/types/achievements.ts`
- [ ] Create `src/app/pages/AchievementsPage.tsx`
- [ ] Create `src/app/components/admin/AchievementsManager.tsx`
- [ ] Features:
  - List all achievements with progress tracking
  - Create/edit achievements with Arabic title
  - Set target values and XP rewards
  - Achievement types (DAILY, WEEKLY, MONTHLY, SPECIAL)
  - Link achievements to badges

**Files to Create:**
- `src/api/achievements.ts`
- `src/hooks/useAchievements.ts`
- `src/types/achievements.ts`
- `src/app/pages/AchievementsPage.tsx`
- `src/app/components/admin/AchievementsManager.tsx`

**Files to Modify:**
- `src/app/App.tsx` (add route)

---

#### 2.3 Reels Management Page
**Status:** ❌ NOT STARTED
**API Endpoint:** `/api/reels`

**Tasks:**
- [ ] Create `src/api/reels.ts`
- [ ] Create `src/hooks/useReels.ts`
- [ ] Create `src/types/reels.ts`
- [ ] Create `src/app/pages/ReelsPage.tsx`
- [ ] Create `src/app/components/admin/ReelsManager.tsx`
- [ ] Features:
  - List all user reels with media preview
  - Approve/reject reels
  - Set expiration dates
  - View reel statistics (views, XP rewards)

**Files to Create:**
- `src/api/reels.ts`
- `src/hooks/useReels.ts`
- `src/types/reels.ts`
- `src/app/pages/ReelsPage.tsx`
- `src/app/components/admin/ReelsManager.tsx`

**Files to Modify:**
- `src/app/App.tsx` (add route)

---

#### 2.4 Contests Management Page
**Status:** ❌ NOT STARTED
**API Endpoint:** `/api/contest`

**Tasks:**
- [ ] Create `src/api/contests.ts`
- [ ] Create `src/hooks/useContests.ts`
- [ ] Create `src/types/contests.ts`
- [ ] Create `src/app/pages/ContestsPage.tsx`
- [ ] Create `src/app/components/admin/ContestsManager.tsx`
- [ ] Features:
  - Create time-based contests
  - Select questions for contests
  - Set XP rewards
  - View contest results

**Files to Create:**
- `src/api/contests.ts`
- `src/hooks/useContests.ts`
- `src/types/contests.ts`
- `src/app/pages/ContestsPage.tsx`
- `src/app/components/admin/ContestsManager.tsx`

**Files to Modify:**
- `src/app/App.tsx` (add route)

---

### Phase 3: Enhancements & Improvements (Low Priority)

#### 3.1 Leaderboard Page
**Status:** ❌ NOT STARTED
**API Endpoint:** `/api/leaderboard`

**Tasks:**
- [ ] Create read-only leaderboard view
- [ ] Display top users by XP
- [ ] Filter by category
- [ ] Filter by time period (daily, weekly, monthly, all-time)

---

#### 3.2 Dashboard Enhancements
**Status:** ❌ NOT STARTED

**Tasks:**
- [ ] Remove hardcoded admin name - fetch from API
- [ ] Make recent activity dynamic from API
- [ ] Add more statistics widgets
- [ ] Add export functionality for questions

---

#### 3.3 UI/UX Improvements
**Status:** ❌ NOT STARTED

**Tasks:**
- [ ] Replace `alert()` with toast notifications everywhere
- [ ] Add loading skeletons for better UX
- [ ] Add keyboard navigation support
- [ ] Improve accessibility (ARIA labels)
- [ ] Add bulk operations UI for questions
- [ ] Add confirmation dialogs for destructive actions

---

## 🗂️ File Structure After Implementation

```
src/
├── api/
│   ├── auth.ts ✅
│   ├── badges.ts ❌ NEW
│   ├── achievements.ts ❌ NEW
│   ├── contests.ts ❌ NEW
│   ├── courses.ts ✅
│   ├── dashboard.ts ✅
│   ├── learning-path.ts ✅
│   ├── levels.ts ❌ NEW
│   ├── library.ts ❌ NEW
│   ├── questions.ts ✅
│   ├── reels.ts ❌ NEW
│   ├── stages.ts ❌ NEW
│   └── users.ts ✅
├── hooks/
│   ├── useAuth.ts ✅
│   ├── useBadges.ts ❌ NEW
│   ├── useAchievements.ts ❌ NEW
│   ├── useContests.ts ❌ NEW
│   ├── useCategories.ts ✅ FIXED
│   ├── useCourses.ts ✅
│   ├── useDashboard.ts ✅
│   ├── useLearningPath.ts ✅
│   ├── useLevels.ts ❌ NEW
│   ├── useLibrary.ts ❌ NEW
│   ├── useQuestions.ts ✅
│   ├── useReels.ts ❌ NEW
│   ├── useStages.ts ❌ NEW
│   └── useUsers.ts ✅
├── types/
│   ├── badges.ts ❌ NEW
│   ├── achievements.ts ❌ NEW
│   ├── contests.ts ❌ NEW
│   ├── courses.ts ✅
│   ├── levels.ts ❌ NEW
│   ├── library.ts ❌ NEW
│   ├── questions.ts ✅
│   ├── reels.ts ❌ NEW
│   ├── stages.ts ❌ NEW
│   └── users.ts ✅
└── app/
    ├── pages/
    │   ├── AchievementsPage.tsx ❌ NEW
    │   ├── BadgesPage.tsx ❌ NEW
    │   ├── ContestsPage.tsx ❌ NEW
    │   ├── CoursesPage.tsx ✅
    │   ├── DashboardPage.tsx ✅
    │   ├── HierarchicalViewPage.tsx ⚠️ NEEDS WORK
    │   ├── LeaderboardPage.tsx ❌ NEW
    │   ├── LibraryPage.tsx ⚠️ NEEDS API
    │   ├── QuestionsPage.tsx ✅ FIXED
    │   ├── ReelsPage.tsx ❌ NEW
    │   └── UsersPage.tsx ✅
    └── components/
        └── admin/
            ├── AchievementsManager.tsx ❌ NEW
            ├── BadgesManager.tsx ❌ NEW
            ├── ContestsManager.tsx ❌ NEW
            ├── HierarchicalView.tsx ⚠️ NEEDS WORK
            ├── LibraryManager.tsx ⚠️ NEEDS API
            ├── QuestionsManagerAdvanced.tsx ✅ FIXED
            └── ReelsManager.tsx ❌ NEW
```

---

## 📊 Progress Tracking

| Phase | Task | Status | Priority |
|-------|------|--------|----------|
| ✅ | Fix useCategories bug | DONE | CRITICAL |
| 1.1 | Library API Integration | TODO | HIGH |
| 1.2 | Hierarchical View | TODO | HIGH |
| 2.1 | Badges Management | TODO | MEDIUM |
| 2.2 | Achievements Management | TODO | MEDIUM |
| 2.3 | Reels Management | TODO | MEDIUM |
| 2.4 | Contests Management | TODO | MEDIUM |
| 3.1 | Leaderboard Page | TODO | LOW |
| 3.2 | Dashboard Enhancements | TODO | LOW |
| 3.3 | UI/UX Improvements | TODO | LOW |

---

## 🎯 Next Steps

1. **Start with Library API Integration** (1.1) - connects existing page to real data
2. **Implement Hierarchical View** (1.2) - enables Stage/Level management
3. **Add management pages** (2.1-2.4) - complete admin functionality
4. **Enhancements** (3.x) - polish and improve UX

---

*Last Updated: 2025-02-26*
