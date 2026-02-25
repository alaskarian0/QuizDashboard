import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Copy, BookOpen, Award, FileText, Layers, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  subcategory: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  imageUrl?: string;
  videoUrl?: string;
  externalLinks?: string[];
  references: string[];
  tags: string[];
  author: string;
  readTime: number; // بالدقائق
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeLibraryManagerProps {
  isDark: boolean;
  onBack?: () => void;
}

export function KnowledgeLibraryManager({ isDark, onBack }: KnowledgeLibraryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedSubcategory, setSelectedSubcategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [viewingTopic, setViewingTopic] = useState<Topic | null>(null);

  const categories = [
    'الكل',
    'الأئمة الاثنا عشر',
    'أصول الدين',
    'فروع الدين',
    'العقائد الشيعية',
    'التاريخ الإسلامي',
    'الفقه والشريعة',
    'الأخلاق والسلوك',
    'القرآن والتفسير',
    'الأدعية والزيارات'
  ];

  const subcategories: Record<string, string[]> = {
    'الأئمة الاثنا عشر': ['سيرة الأئمة', 'كرامات الأئمة', 'أقوال الأئمة', 'مراقد الأئمة'],
    'أصول الدين': ['التوحيد', 'العدل', 'النبوة', 'الإمامة', 'المعاد'],
    'فروع الدين': ['الصلاة', 'الصوم', 'الزكاة', 'الحج', 'الخمس', 'الجهاد', 'الأمر بالمعروف'],
    'العقائد الشيعية': ['الولاية', 'البداء', 'الرجعة', 'التقية', 'الشفاعة'],
    'التاريخ الإسلامي': ['عهد النبي', 'عهد الأئمة', 'الدولة الأموية', 'الدولة العباسية', 'واقعة كربلاء'],
    'الأدعية والزيارات': ['الزيارات', 'الأدعية المأثورة', 'زيارة عاشوراء', 'الزيارة الجامعة']
  };

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'أصول الدين الخمسة عند الشيعة الإمامية',
      summary: 'شرح مفصل لأصول الدين الخمسة: التوحيد، العدل، النبوة، الإمامة، والمعاد',
      content: 'أصول الدين الخمسة هي القواعد الأساسية التي يقوم عليها الإيمان عند الشيعة الإمامية...',
      category: 'أصول الدين',
      subcategory: 'العقائد',
      difficulty: 'مبتدئ',
      imageUrl: 'https://example.com/usul-ad-din.jpg',
      references: [
        'كتاب الاعتقادات - الشيخ المفيد',
        'تصحيح الاعتقاد - الشيخ الطوسي',
        'عقائد الإمامية - الشيخ المظفر'
      ],
      tags: ['أصول الدين', 'عقائد', 'أساسيات', 'توحيد', 'عدل', 'نبوة', 'إمامة', 'معاد'],
      author: 'فريق المحتوى',
      readTime: 15,
      views: 5420,
      likes: 892,
      isPublished: true,
      isFeatured: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-02-01'
    },
    {
      id: '2',
      title: 'سيرة الإمام علي الرضا (ع) - الإمام الثامن',
      summary: 'سيرة حياة الإمام الثامن علي بن موسى الرضا (ع) من الولادة حتى الشهادة',
      content: 'ولد الإمام علي الرضا (ع) في المدينة المنورة في 11 ذي القعدة سنة 148 هـ...',
      category: 'الأئمة الاثنا عشر',
      subcategory: 'سيرة الأئمة',
      difficulty: 'متوسط',
      imageUrl: 'https://example.com/imam-rida.jpg',
      videoUrl: 'https://example.com/imam-rida-video.mp4',
      references: [
        'كتاب الكافي - الكليني',
        'إعلام الورى - الطبرسي',
        'عيون أخبار الرضا - الشيخ الصدوق'
      ],
      tags: ['الإمام الرضا', 'الأئمة', 'السيرة', 'تاريخ', 'مشهد'],
      author: 'الشيخ أحمد العلوي',
      readTime: 25,
      views: 8750,
      likes: 1456,
      isPublished: true,
      isFeatured: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-28'
    },
    {
      id: '3',
      title: 'البداء في العقيدة الشيعية - مفهوم وشرح',
      summary: 'توضيح مفهوم البداء وحقيقته في العقيدة الشيعية والرد على الشبهات',
      content: 'البداء لغة: الظهور بعد الخفاء. والبداء في العقيدة الشيعية يعني...',
      category: 'العقائد الشيعية',
      subcategory: 'العقائد',
      difficulty: 'متقدم',
      references: [
        'التوحيد - الشيخ الصدوق',
        'بحار الأنوار - المجلسي',
        'الميزان في تفسير القرآن - الطباطبائي'
      ],
      tags: ['عقائد', 'البداء', 'علم الله', 'فلسفة'],
      author: 'د. حسن الموسوي',
      readTime: 20,
      views: 3280,
      likes: 567,
      isPublished: true,
      isFeatured: false,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-25'
    },
    {
      id: '4',
      title: 'واقعة كربلاء - نظرة شاملة',
      summary: 'دراسة تاريخية شاملة لواقعة الطف في كربلاء وأحداثها ونتائجها',
      content: 'وقعت واقعة كربلاء في يوم العاشر من محرم سنة 61 للهجرة...',
      category: 'التاريخ الإسلامي',
      subcategory: 'واقعة كربلاء',
      difficulty: 'متوسط',
      imageUrl: 'https://example.com/karbala.jpg',
      videoUrl: 'https://example.com/karbala-documentary.mp4',
      externalLinks: [
        'https://karbala-history.org',
        'https://imam-hussain.org'
      ],
      references: [
        'مقتل الحسين - المقرم',
        'تاريخ الطبري',
        'الإرشاد - الشيخ المفيد',
        'اللهوف على قتلى الطفوف - ابن طاووس'
      ],
      tags: ['كربلاء', 'عاشوراء', 'الإمام الحسين', 'تاريخ', 'ثورة'],
      author: 'فريق البحث التاريخي',
      readTime: 35,
      views: 12500,
      likes: 2890,
      isPublished: true,
      isFeatured: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-02-02'
    },
    {
      id: '5',
      title: 'الزيارة الجامعة الكبيرة - شرح ومعاني',
      summary: 'شرح مفصل للزيارة الجامعة الكبيرة المروية عن الإمام الهادي (ع)',
      content: 'الزيارة الجامعة الكبيرة من أعظم الزيارات وأشملها...',
      category: 'الأدعية والزيارات',
      subcategory: 'الزيارة الجامعة',
      difficulty: 'متوسط',
      references: [
        'مفاتيح الجنان - الشيخ عباس القمي',
        'بحار الأنوار - المجلسي',
        'وسائل الشيعة - الحر العاملي'
      ],
      tags: ['زيارات', 'أدعية', 'أهل البيت', 'الإمام الهادي'],
      author: 'الشيخ محمد الكاظمي',
      readTime: 18,
      views: 6180,
      likes: 1024,
      isPublished: true,
      isFeatured: false,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-30'
    },
    {
      id: '6',
      title: 'فلسفة الإمامة عند الشيعة الإمامية',
      summary: 'دراسة فلسفية عميقة لمفهوم الإمامة ودورها في الإسلام',
      content: 'الإمامة عند الشيعة الإمامية هي استمرار للنبوة...',
      category: 'أصول الدين',
      subcategory: 'الإمامة',
      difficulty: 'متقدم',
      references: [
        'الشافي في الإمامة - الشريف المرتضى',
        'تلخيص الشافي - الطوسي',
        'الألفين - العلامة الحلي'
      ],
      tags: ['إمامة', 'فلسفة', 'عقائد', 'الأئمة'],
      author: 'د. علي النجفي',
      readTime: 30,
      views: 4560,
      likes: 782,
      isPublished: false,
      isFeatured: false,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-02'
    }
  ]);

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || t.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'الكل' || t.subcategory === selectedSubcategory;
    const matchesStatus = selectedStatus === 'الكل' || 
                         (selectedStatus === 'منشور' && t.isPublished) ||
                         (selectedStatus === 'مسودة' && !t.isPublished) ||
                         (selectedStatus === 'مميز' && t.isFeatured);
    return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus;
  });

  const handleDeleteTopic = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
      setTopics(topics.filter(t => t.id !== id));
    }
  };

  const handleTogglePublish = (id: string) => {
    setTopics(topics.map(t => 
      t.id === id ? { ...t, isPublished: !t.isPublished } : t
    ));
  };

  const handleToggleFeatured = (id: string) => {
    setTopics(topics.map(t => 
      t.id === id ? { ...t, isFeatured: !t.isFeatured } : t
    ));
  };

  const handleDuplicateTopic = (topic: Topic) => {
    const newTopic = {
      ...topic,
      id: Date.now().toString(),
      title: topic.title + ' (نسخة)',
      views: 0,
      likes: 0,
      isPublished: false,
      isFeatured: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTopics([newTopic, ...topics]);
  };

  const getStats = () => {
    return {
      total: topics.length,
      published: topics.filter(t => t.isPublished).length,
      drafts: topics.filter(t => !t.isPublished).length,
      featured: topics.filter(t => t.isFeatured).length,
      totalViews: topics.reduce((sum, t) => sum + t.views, 0),
      totalLikes: topics.reduce((sum, t) => sum + t.likes, 0)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-cyan-900/30' : 'bg-cyan-100'
          }`}>
            <BookOpen className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </div>
          <div>
            <h2 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              إدارة مكتبة المعرفة
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إدارة المواضيع والمقالات المعرفية الإسلامية الشيعية
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-gradient-to-br from-cyan-600 to-cyan-800' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'
        }`}>
          <div className="text-white">
            <p className="text-cyan-100 text-sm mb-1">إجمالي المواضيع</p>
            <h3 className="text-3xl" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              {stats.total}
            </h3>
          </div>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المنشورة</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.published}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المسودات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.drafts}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المميزة</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.featured}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المشاهدات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.totalViews.toLocaleString('ar-SA')}
          </h3>
        </div>

        <div className={`p-4 rounded-2xl shadow-lg ${
          isDark ? 'bg-[#1A2C2B]' : 'bg-white'
        }`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>الإعجابات</p>
          <h3 className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {stats.totalLikes.toLocaleString('ar-SA')}
          </h3>
        </div>
      </div>

      {/* Library Info */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-2 border-cyan-600/30' : 'bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-2 border-cyan-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
              📚 مكتبة المعرفة الإسلامية الشيعية
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              موسوعة شاملة تضم المقالات والمواضيع المعرفية الإسلامية الشيعية مع المراجع والمصادر الموثوقة
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-cyan-900/50' : 'bg-cyan-200'}`}>
            <Layers className={`w-8 h-8 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDark ? 'bg-[#1A2C2B]' : 'bg-white'
      }`}>
        <div className="flex flex-col gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="ابحث في المواضيع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white placeholder-gray-500 focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
              } outline-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('الكل');
              }}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
              } outline-none`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {selectedCategory !== 'الكل' && subcategories[selectedCategory] && (
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  isDark 
                    ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-cyan-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
                } outline-none`}
                style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
              >
                <option value="الكل">كل التصنيفات الفرعية</option>
                {subcategories[selectedCategory].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            )}

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
              } outline-none`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}
            >
              <option value="الكل">الكل</option>
              <option value="منشور">منشور</option>
              <option value="مسودة">مسودة</option>
              <option value="مميز">مميز</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all col-span-2 ${
                isDark 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
            >
              <Plus className="w-5 h-5" />
              إضافة موضوع جديد
            </button>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
          المواضيع ({filteredTopics.length})
        </h3>

        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
              isDark ? 'bg-[#1A2C2B]' : 'bg-white'
            } ${!topic.isPublished ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                        {topic.category} • {topic.subcategory}
                      </span>
                    </div>
                    <h4 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                      {topic.title}
                    </h4>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {topic.summary}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        topic.difficulty === 'مبتدئ' 
                          ? isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                          : topic.difficulty === 'متوسط'
                          ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                          : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                      }`}>
                        {topic.difficulty}
                      </span>
                      {!topic.isPublished && (
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          isDark ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          📝 مسودة
                        </span>
                      )}
                      {topic.isFeatured && (
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                        }`}>
                          ⭐ مميز
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                        📖 {topic.readTime} دقيقة
                      </span>
                      {topic.imageUrl && (
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                        }`}>
                          🖼️ صورة
                        </span>
                      )}
                      {topic.videoUrl && (
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                        }`}>
                          🎥 فيديو
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl mb-3 ${
                  isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>المؤلف:</strong> {topic.author}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {topic.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded ${
                        isDark ? 'bg-[#1A2C2B] text-cyan-400' : 'bg-white text-cyan-600'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                    {topic.tags.length > 5 && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDark ? 'bg-[#1A2C2B] text-gray-400' : 'bg-white text-gray-600'
                      }`}>
                        +{topic.tags.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {topic.references && topic.references.length > 0 && (
                  <div className={`p-3 rounded-xl mb-3 ${
                    isDark ? 'bg-amber-900/10 border border-amber-600/30' : 'bg-amber-50 border border-amber-300'
                  }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                      📚 المراجع ({topic.references.length}):
                    </p>
                    <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                      {topic.references.slice(0, 2).map((ref, idx) => (
                        <li key={idx}>• {ref}</li>
                      ))}
                      {topic.references.length > 2 && (
                        <li className="text-xs">... و {topic.references.length - 2} مراجع أخرى</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className={`grid grid-cols-4 gap-4 p-3 rounded-xl ${
                  isDark ? 'bg-[#0D1B1A]' : 'bg-gray-50'
                }`}>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>المشاهدات</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                      {topic.views.toLocaleString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الإعجابات</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                      {topic.likes.toLocaleString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>تاريخ النشر</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                      {new Date(topic.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>آخر تحديث</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>
                      {new Date(topic.updatedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setViewingTopic(topic)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                      : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                  }`}
                  title="عرض"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingTopic(topic)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="تعديل"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDuplicateTopic(topic)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50'
                      : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                  }`}
                  title="نسخ"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleToggleFeatured(topic.id)}
                  className={`p-2 rounded-lg transition-all ${
                    topic.isFeatured
                      ? isDark 
                        ? 'bg-amber-900/50 text-amber-300 hover:bg-amber-900/70'
                        : 'bg-amber-200 text-amber-700 hover:bg-amber-300'
                      : isDark
                        ? 'bg-gray-900/30 text-gray-400 hover:bg-gray-900/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={topic.isFeatured ? 'إلغاء التمييز' : 'تمييز'}
                >
                  <span className="text-xs">{topic.isFeatured ? '⭐' : '☆'}</span>
                </button>
                <button
                  onClick={() => handleTogglePublish(topic.id)}
                  className={`p-2 rounded-lg transition-all ${
                    topic.isPublished
                      ? isDark 
                        ? 'bg-gray-900/30 text-gray-400 hover:bg-gray-900/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : isDark
                        ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                  title={topic.isPublished ? 'إخفاء' : 'نشر'}
                >
                  <span className="text-xs">{topic.isPublished ? '👁️' : '📝'}</span>
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTopics.length === 0 && (
          <div className={`p-12 text-center rounded-2xl ${
            isDark ? 'bg-[#1A2C2B]' : 'bg-white'
          }`}>
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              لا توجد مواضيع
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
