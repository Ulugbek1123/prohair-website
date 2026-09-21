import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Download,
  Trash2,
  RefreshCw,
  LogOut,
  Lock,
  User,
  Shield,
  ExternalLink,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  Building2,
  Sparkles,
  BookOpen,
  MessageSquare,
  KeyRound,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/ui/button';
import { apiUrl } from '../lib/api-client';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'O‘zSTTA — Boshqaruv paneli (Admin)' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminPage,
});

interface ApplicationItem {
  id: number | string;
  date: string;
  full_name: string;
  phone: string;
  email?: string;
  country?: string;
  role?: string;
  workplace?: string;
  comment?: string;
  event?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  type: 'pre_registration' | 'association' | 'course' | 'contact' | 'submission_2026';
  price_usd?: string;
  price_uzs?: number;
}

interface AnalyticsOverview {
  totalViews: number;
  totalUnique: number;
  todayViews: number;
  todayUnique: number;
}

interface DailyStat {
  date: string;
  views: number;
  visitors: number;
}

interface PageStat {
  path: string;
  views: number;
  visitors: number;
}

interface DeviceStat {
  name: string;
  value: number;
}

interface SourceStat {
  source: string;
  count: number;
}

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'analytics' | 'settings'>('overview');

  // Applications state
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    pre_registration: 0,
    association: 0,
    course: 0,
    contact: 0,
    submission_2026: 0,
  });
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [loadingApps, setLoadingApps] = useState(false);

  // Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview>({
    totalViews: 0,
    totalUnique: 0,
    todayViews: 0,
    todayUnique: 0,
  });
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);
  const [pagesData, setPagesData] = useState<PageStat[]>([]);
  const [devicesData, setDevicesData] = useState<DeviceStat[]>([]);
  const [sourcesData, setSourcesData] = useState<SourceStat[]>([]);
  const [daysRange, setDaysRange] = useState(14);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Settings form state
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('prohair_admin_token');
    if (!savedToken) {
      setIsVerifying(false);
      return;
    }

    fetch(apiUrl('/api/admin/verify'), {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Auth failed'))))
      .then((data) => {
        if (data.success) {
          setToken(savedToken);
        } else {
          localStorage.removeItem('prohair_admin_token');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('prohair_admin_token');
        setToken(null);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (token) {
      fetchApplications();
      fetchAnalytics();
    }
  }, [token, typeFilter, statusFilter, daysRange]);

  const fetchApplications = async () => {
    if (!token) return;
    setLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(apiUrl(`/api/admin/applications?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setApplications(data.data || []);
          if (data.counts) setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Fetch apps error:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoadingAnalytics(true);
    try {
      const [overviewRes, dailyRes, pagesRes, devicesRes, sourcesRes] = await Promise.all([
        fetch(apiUrl('/api/admin/analytics/overview'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/admin/analytics/daily?days=${daysRange}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/admin/analytics/pages'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/admin/analytics/devices'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/admin/analytics/sources'), { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const overview = overviewRes.ok ? await overviewRes.json() : null;
      const daily = dailyRes.ok ? await dailyRes.json() : null;
      const pages = pagesRes.ok ? await pagesRes.json() : null;
      const devices = devicesRes.ok ? await devicesRes.json() : null;
      const sources = sourcesRes.ok ? await sourcesRes.json() : null;

      if (overview?.success) {
        setAnalyticsOverview({
          totalViews: overview.totalViews,
          totalUnique: overview.totalUnique,
          todayViews: overview.todayViews,
          todayUnique: overview.todayUnique,
        });
      }
      if (daily?.success) setDailyData(daily.data || []);
      if (pages?.success) setPagesData(pages.data || []);
      if (devices?.success) setDevicesData(devices.devices || []);
      if (sources?.success) setSourcesData(sources.data || []);
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const targetUrl = apiUrl('/api/admin/login');
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser.trim(), password: loginPass.trim() }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Agar response JSON bo'lmasa (masalan, noto'g'ri portdagi 404 HTML)
      }

      if (res.ok && data?.success && data?.token) {
        localStorage.setItem('prohair_admin_token', data.token);
        setToken(data.token);
      } else {
        setLoginError(data?.message || 'Login yoki parol noto‘g‘ri.');
      }
    } catch (err: any) {
      console.error('Login connection error:', err);
      setLoginError('Server bilan bog‘lanishda xatolik yuz berdi. Backend serveri (port 5000) ishlab turganligini tekshiring.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('prohair_admin_token');
    setToken(null);
  };

  const updateStatus = async (item: ApplicationItem, newStatus: ApplicationItem['status']) => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl(`/api/admin/applications/${item.type}/${item.id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setApplications((prev) =>
            prev.map((app) => (app.id === item.id && app.type === item.type ? { ...app, status: newStatus } : app))
          );
          if (selectedApp && selectedApp.id === item.id) {
            setSelectedApp({ ...selectedApp, status: newStatus });
          }
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const deleteApplication = async (item: ApplicationItem) => {
    if (!confirm(`Haqiqatan ham ${item.full_name || 'ushbu arizani'} o‘chirmoqchimisiz?`)) return;
    if (!token) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/applications/${item.type}/${item.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setApplications((prev) => prev.filter((app) => !(app.id === item.id && app.type === item.type)));
          if (selectedApp && selectedApp.id === item.id) setSelectedApp(null);
        }
      }
    } catch (err) {
      console.error('Delete application error:', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus(null);
    if (!oldPassword) {
      setSettingsStatus({ type: 'error', message: 'Iltimos, joriy parolni kiriting.' });
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/admin/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsStatus({ type: 'success', message: data.message || 'Muvaffaqiyatli yangilandi!' });
        setOldPassword('');
        setNewPassword('');
      } else {
        setSettingsStatus({ type: 'error', message: data.message || 'Xatolik yuz berdi.' });
      }
    } catch {
      setSettingsStatus({ type: 'error', message: 'Server bilan aloqada xatolik.' });
    }
  };

  const exportCSV = () => {
    if (applications.length === 0) return;
    const headers = ['Sana', 'Tur', 'F.I.Sh.', 'Telefon', 'Email', 'Mamlakat/Shahar', 'Rol/Mavzu', 'Status', 'Izoh'];
    const rows = applications.map((app) => [
      new Date(app.date).toLocaleString('ru-RU'),
      app.type,
      `"${app.full_name || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.email || ''}"`,
      `"${app.country || ''}"`,
      `"${app.role || ''}"`,
      app.status,
      `"${(app.comment || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prohair_arizalar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (type: ApplicationItem['type']) => {
    switch (type) {
      case 'pre_registration':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
            <Sparkles className="size-3" /> PROHAIR 2027
          </span>
        );
      case 'association':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <Building2 className="size-3" /> Assotsiatsiya
          </span>
        );
      case 'course':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            <BookOpen className="size-3" /> Ta’lim / Kurs
          </span>
        );
      case 'contact':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <MessageSquare className="size-3" /> Qayta aloqa
          </span>
        );
      case 'submission_2026':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-500/30 bg-zinc-500/10 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">
            PROHAIR 2026
          </span>
        );
    }
  };

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-300">
            <Clock className="size-3" /> Yangi
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-300">
            <Phone className="size-3" /> Bog‘lanildi
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="size-3" /> Tasdiqlandi
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-xs font-medium text-rose-300">
            <XCircle className="size-3" /> Rad etildi
          </span>
        );
      default:
        return null;
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (app.full_name && app.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.phone && app.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.country && app.country.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [applications, searchQuery]);

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b19] text-white">
        <RefreshCw className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  // --- 1. LOGIN SCREEN ---
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a17] px-4 py-12 text-slate-100 relative overflow-hidden">
        {/* Background glow atmosphere */}
        <div className="absolute -top-40 -left-40 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent/20 border border-accent/30 text-accent mb-4">
              <Shield className="size-7" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">PROHAIR ADMIN</h1>
            <p className="mt-2 text-xs text-slate-400">O‘zSTTA Assotsiatsiyasi boshqaruv paneli</p>
          </div>

          {loginError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="size-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Login
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Parol
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="mt-6 w-full h-12 rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:bg-accent/90 transition-all"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="size-4 mr-2 animate-spin" /> Tekshirilmoqda...
                </>
              ) : (
                'Tizimga kirish'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Standart ma‘lumotlar: <span className="text-slate-400">admin</span> / <span className="text-slate-400">prohair2027!</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ADMIN DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b19]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold">
              P
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white">PROHAIR</span>
              <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-white/15 bg-white/5 hover:bg-white/10 text-xs">
              <Link to="/" target="_blank">
                Saytni ochish <ExternalLink className="ml-1 size-3.5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchApplications();
                fetchAnalytics();
              }}
              className="border-white/15 bg-white/5 hover:bg-white/10 text-xs"
              title="Ma'lumotlarni yangilash"
            >
              <RefreshCw className={`size-3.5 ${loadingApps || loadingAnalytics ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs"
            >
              <LogOut className="size-3.5 mr-1" /> Chiqish
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="size-4" />
            Umumiy ko‘rinish
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'applications'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="size-4" />
            Kelgan arizalar
            {counts.all > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === 'applications' ? 'bg-black/20 text-black' : 'bg-accent/20 text-accent'
                }`}
              >
                {counts.all}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="size-4" />
            Tashriflar analitikasi
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="size-4" />
            Sozlamalar
          </button>
        </div>

        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami arizalar</span>
                  <div className="size-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Users className="size-5" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white">{counts.all}</p>
                <p className="mt-1 text-xs text-slate-400">Barcha shakllardan tushgan</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PROHAIR 2027</span>
                  <div className="size-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="size-5" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white">{counts.pre_registration}</p>
                <p className="mt-1 text-xs text-slate-400">Dastlabki ro‘yxatdan o‘tganlar</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami ko‘rishlar</span>
                  <div className="size-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Eye className="size-5" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white">{analyticsOverview.totalViews}</p>
                <p className="mt-1 text-xs text-slate-400">{analyticsOverview.totalUnique} ta unikal foydalanuvchi</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bugungi tashriflar</span>
                  <div className="size-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="size-5" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white">{analyticsOverview.todayViews}</p>
                <p className="mt-1 text-xs text-slate-400">{analyticsOverview.todayUnique} ta unikal bugun</p>
              </div>
            </div>

            {/* Quick Chart & Recent Applications */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Daily Chart Box */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg text-white">Tashriflar dinamikasi (14 kun)</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('analytics')} className="text-xs text-accent">
                    Batafsil analitika →
                  </Button>
                </div>
                <div className="h-64 w-full">
                  {dailyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="views" name="Ko‘rishlar" stroke="#d4af37" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      Tashriflar hali qayd etilmadi. Saytga kirilganda avtomatik to‘planadi.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Categories Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white mb-4">Arizalar taqsimoti</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="flex items-center gap-2">
                        <Sparkles className="size-4 text-purple-400" /> PROHAIR 2027
                      </span>
                      <span className="font-bold text-white">{counts.pre_registration}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="flex items-center gap-2">
                        <Building2 className="size-4 text-emerald-400" /> Assotsiatsiya a’zoligi
                      </span>
                      <span className="font-bold text-white">{counts.association}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4 text-blue-400" /> Kurslar va Ta’lim
                      </span>
                      <span className="font-bold text-white">{counts.course}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="size-4 text-amber-400" /> Qayta aloqa xabarlari
                      </span>
                      <span className="font-bold text-white">{counts.contact}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="flex items-center gap-2">
                        <Users className="size-4 text-zinc-400" /> PROHAIR 2026 (Arxiv)
                      </span>
                      <span className="font-bold text-white">{counts.submission_2026}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setActiveTab('applications')}
                  className="mt-6 w-full h-11 rounded-xl bg-accent text-accent-foreground font-bold text-xs hover:bg-accent/90"
                >
                  Barcha arizalarni boshqarish →
                </Button>
              </div>
            </div>

            {/* Recent 5 Applications */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg text-white">So‘nggi kelgan arizalar</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('applications')} className="text-xs text-accent">
                  Barchasini ko‘rish ({applications.length}) →
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3 font-semibold">Sana</th>
                      <th className="pb-3 font-semibold">Turi</th>
                      <th className="pb-3 font-semibold">F.I.Sh.</th>
                      <th className="pb-3 font-semibold">Telefon</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={`${app.type}-${app.id}`} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-slate-400 whitespace-nowrap">
                          {new Date(app.date).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-3">{getTypeBadge(app.type)}</td>
                        <td className="py-3 font-semibold text-white">{app.full_name || '—'}</td>
                        <td className="py-3 text-slate-300">
                          <a href={`tel:${app.phone}`} className="hover:text-accent underline">
                            {app.phone}
                          </a>
                        </td>
                        <td className="py-3">{getStatusBadge(app.status)}</td>
                        <td className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedApp(app)}
                            className="h-8 px-2.5 text-xs text-accent hover:bg-accent/10"
                          >
                            Batafsil
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          Hozircha arizalar mavjud emas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: APPLICATIONS --- */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Barchasi', count: counts.all },
                  { id: 'pre_registration', label: 'PROHAIR 2027', count: counts.pre_registration },
                  { id: 'association', label: 'Assotsiatsiya', count: counts.association },
                  { id: 'course', label: 'Kurslar', count: counts.course },
                  { id: 'contact', label: 'Xabarlar', count: counts.contact },
                  { id: 'submission_2026', label: '2026 Arxiv', count: counts.submission_2026 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTypeFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      typeFilter === tab.id
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label} <span className="opacity-60">({tab.count})</span>
                  </button>
                ))}
              </div>

              <Button
                onClick={exportCSV}
                size="sm"
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs"
              >
                <Download className="size-3.5 mr-1.5" /> CSV ga yuklab olish
              </Button>
            </div>

            {/* Search and Status Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ism, telefon, email yoki mamlakat bo‘yicha qidiruv..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-accent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-[#0f172a] px-3 text-xs text-slate-300 outline-none focus:border-accent"
              >
                <option value="all">Barcha statuslar</option>
                <option value="new">Yangi (New)</option>
                <option value="contacted">Bog‘lanildi (Contacted)</option>
                <option value="confirmed">Tasdiqlandi (Confirmed)</option>
                <option value="cancelled">Rad etildi (Cancelled)</option>
              </select>
            </div>

            {/* Table Box */}
            <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="py-3.5 px-4 font-semibold">Sana</th>
                      <th className="py-3.5 px-4 font-semibold">Turi</th>
                      <th className="py-3.5 px-4 font-semibold">F.I.Sh.</th>
                      <th className="py-3.5 px-4 font-semibold">Telefon</th>
                      <th className="py-3.5 px-4 font-semibold">Hudud / Ish joyi</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredApps.map((app) => (
                      <tr key={`${app.type}-${app.id}`} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(app.date).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{getTypeBadge(app.type)}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{app.full_name || '—'}</p>
                          {app.email && <p className="text-[11px] text-slate-400">{app.email}</p>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-200">
                          <a href={`tel:${app.phone}`} className="hover:text-accent underline flex items-center gap-1">
                            <Phone className="size-3 text-accent" />
                            {app.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <p>{app.country || '—'}</p>
                          {app.workplace && <p className="text-[11px] text-slate-500">{app.workplace}</p>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={app.status || 'new'}
                            onChange={(e) => updateStatus(app, e.target.value as ApplicationItem['status'])}
                            className="h-8 rounded-lg border border-white/10 bg-[#0f172a] px-2 text-xs font-medium text-slate-300 outline-none focus:border-accent"
                          >
                            <option value="new">🟡 Yangi</option>
                            <option value="contacted">🔵 Bog‘lanildi</option>
                            <option value="confirmed">🟢 Tasdiqlandi</option>
                            <option value="cancelled">🔴 Rad etildi</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedApp(app)}
                              className="h-8 px-2 text-xs text-accent hover:bg-accent/10"
                            >
                              Tafsilot
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteApplication(app)}
                              className="h-8 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                              title="O‘chirish"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          {loadingApps ? 'Yuklanmoqda...' : 'Ushbu filtr bo‘yicha arizalar topilmadi.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Date selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Sayt tashriflari statistikasi</h2>
                <p className="text-xs text-slate-400 mt-1">Real vaqtda qayd etilgan sahifalar ko‘rilishi va unikal foydalanuvchilar</p>
              </div>

              <div className="flex gap-2">
                {[
                  { days: 7, label: '7 kun' },
                  { days: 14, label: '14 kun' },
                  { days: 30, label: '30 kun' },
                ].map((item) => (
                  <button
                    key={item.days}
                    onClick={() => setDaysRange(item.days)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      daysRange === item.days
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami ko‘rishlar</span>
                <p className="mt-2 font-serif text-3xl font-bold text-accent">{analyticsOverview.totalViews}</p>
                <p className="mt-1 text-[11px] text-slate-500">Sayt ishga tushgandan buyon</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unikal foydalanuvchilar</span>
                <p className="mt-2 font-serif text-3xl font-bold text-blue-400">{analyticsOverview.totalUnique}</p>
                <p className="mt-1 text-[11px] text-slate-500">Turli xil sessiyalar</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bugun ko‘rishlar</span>
                <p className="mt-2 font-serif text-3xl font-bold text-emerald-400">{analyticsOverview.todayViews}</p>
                <p className="mt-1 text-[11px] text-slate-500">Bugungi kun hisobida</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bugungi unikal</span>
                <p className="mt-2 font-serif text-3xl font-bold text-purple-400">{analyticsOverview.todayUnique}</p>
                <p className="mt-1 text-[11px] text-slate-500">Bugungi yangi mehmonlar</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="font-serif font-bold text-lg text-white mb-4">
                Kunlik dinamika: Ko‘rishlar va Mehmonlar ({daysRange} kun)
              </h3>
              <div className="h-80 w-full">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="views" name="Ko‘rishlar (Views)" stroke="#d4af37" fillOpacity={1} fill="url(#viewsGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="visitors" name="Unikal mehmonlar (Visitors)" stroke="#10b981" fillOpacity={1} fill="url(#visitorsGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    Ma‘lumotlar to‘planmoqda...
                  </div>
                )}
              </div>
            </div>

            {/* Pages & Devices */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Pages */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <h3 className="font-serif font-bold text-lg text-white mb-4">Eng ommabop sahifalar</h3>
                <div className="space-y-3">
                  {pagesData.map((p, idx) => {
                    const pct = analyticsOverview.totalViews > 0 ? Math.round((p.views / analyticsOverview.totalViews) * 100) : 0;
                    return (
                      <div key={p.path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-300 truncate max-w-[240px]">
                            {idx + 1}. {p.path === '/' ? '/ (Asosiy sahifa)' : p.path}
                          </span>
                          <span className="font-semibold text-accent">
                            {p.views} ko‘rish <span className="text-slate-500 text-[10px]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${Math.max(pct, 4)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {pagesData.length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">Hali ma‘lumot mavjud emas.</p>
                  )}
                </div>
              </div>

              {/* Devices & Referrers */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white mb-4">Qurilmalar va Tashrif manbalari</h3>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {['desktop', 'mobile', 'tablet'].map((dev) => {
                      const found = devicesData.find((d) => d.name === dev);
                      const count = found ? found.value : 0;
                      return (
                        <div key={dev} className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                          {dev === 'mobile' ? (
                            <Smartphone className="size-5 mx-auto text-blue-400 mb-1" />
                          ) : dev === 'tablet' ? (
                            <Tablet className="size-5 mx-auto text-purple-400 mb-1" />
                          ) : (
                            <Monitor className="size-5 mx-auto text-accent mb-1" />
                          )}
                          <p className="text-xs uppercase font-semibold text-slate-300">{dev}</p>
                          <p className="font-bold text-base text-white mt-0.5">{count}</p>
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tashrif manbalari:</h4>
                  <div className="space-y-2">
                    {sourcesData.map((s) => (
                      <div key={s.source} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <Globe className="size-3.5 text-accent" /> {s.source}
                        </span>
                        <span className="font-bold text-white">{s.count} ta</span>
                      </div>
                    ))}
                    {sourcesData.length === 0 && (
                      <p className="text-xs text-slate-500 py-2">Manbalar hali qayd etilmagan.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl">
              <h2 className="font-serif text-2xl font-bold text-white mb-2">Admin hisob ma‘lumotlari</h2>
              <p className="text-xs text-slate-400 mb-6">Admin panelga kirish uchun login va parolni yangilang</p>

              {settingsStatus && (
                <div
                  className={`mb-6 flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                    settingsStatus.type === 'success'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {settingsStatus.type === 'success' ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
                  <span>{settingsStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Joriy parol <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Joriy parolingizni kiriting"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Yangi Login (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: admin"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Yangi Parol (kamida 6 ta belgi)
                  </label>
                  <input
                    type="password"
                    placeholder="Yangi kuchli parol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-accent"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-4 w-full h-11 rounded-xl bg-accent text-accent-foreground font-bold text-xs hover:bg-accent/90"
                >
                  Ma‘lumotlarni saqlash
                </Button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl text-xs space-y-2 text-slate-400">
              <h3 className="font-semibold text-white text-sm mb-2">Telegram bildirishnomalari</h3>
              <p>Yangi arizalar darhol o‘rnatilgan Telegram kanal/guruhga xabar sifatida yuboriladi.</p>
              <p className="text-slate-500">Bot faol va sozlangan.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- APPLICATION DETAILS MODAL --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0b1228] p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              {getTypeBadge(selectedApp.type)}
              {getStatusBadge(selectedApp.status)}
            </div>

            <h3 className="font-serif text-2xl font-bold text-white">{selectedApp.full_name || 'Ismsiz ariza'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Qabul qilingan sana: {new Date(selectedApp.date).toLocaleString('ru-RU')}
            </p>

            <div className="mt-6 space-y-3.5 text-xs border-y border-white/10 py-5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Telefon:</span>
                <a href={`tel:${selectedApp.phone}`} className="font-semibold text-accent hover:underline flex items-center gap-1">
                  <Phone className="size-3" /> {selectedApp.phone}
                </a>
              </div>

              {selectedApp.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <a href={`mailto:${selectedApp.email}`} className="font-semibold text-white hover:underline flex items-center gap-1">
                    <Mail className="size-3" /> {selectedApp.email}
                  </a>
                </div>
              )}

              {selectedApp.country && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mamlakat / Shahar:</span>
                  <span className="font-medium text-white">{selectedApp.country}</span>
                </div>
              )}

              {selectedApp.role && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Yo‘nalish / Rol:</span>
                  <span className="font-medium text-white">{selectedApp.role}</span>
                </div>
              )}

              {selectedApp.workplace && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ish joyi:</span>
                  <span className="font-medium text-white">{selectedApp.workplace}</span>
                </div>
              )}

              {selectedApp.price_usd && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">To‘lov narxi:</span>
                  <span className="font-bold text-accent">${selectedApp.price_usd}</span>
                </div>
              )}

              {selectedApp.comment && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Izoh / Xabar:</span>
                  <p className="rounded-xl bg-white/5 border border-white/5 p-3 text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.comment}
                  </p>
                </div>
              )}
            </div>

            {/* Status change in modal */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp, e.target.value as ApplicationItem['status'])}
                  className="h-9 rounded-xl border border-white/10 bg-[#0f172a] px-3 text-xs font-semibold text-slate-200 outline-none focus:border-accent"
                >
                  <option value="new">🟡 Yangi</option>
                  <option value="contacted">🔵 Bog‘lanildi</option>
                  <option value="confirmed">🟢 Tasdiqlandi</option>
                  <option value="cancelled">🔴 Rad etildi</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  asChild
                  className="h-9 rounded-xl bg-accent text-accent-foreground font-bold text-xs"
                >
                  <a href={`tel:${selectedApp.phone}`}>
                    <Phone className="size-3.5 mr-1" /> Qo‘ng‘iroq qilish
                  </a>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => deleteApplication(selectedApp)}
                  className="h-9 rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
