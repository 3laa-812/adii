import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useI18nStore } from '@/stores/useI18nStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle } from '@/components/LanguageToggle';
import { 
  LayoutDashboard, 
  Activity, 
  Smartphone, 
  Receipt, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  Menu, 
  X,
  LogOut,
  MapPin,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'overview', count: null },
  { href: '/admin/traffic', icon: Activity, label: 'traffic_live', count: '24' },
  { href: '/admin/devices', icon: Smartphone, label: 'devices', count: '8' },
  { href: '/admin/entries', icon: Receipt, label: 'entries', count: null },
  { href: '/admin/accounts', icon: Users, label: 'accounts', count: null },
  { href: '/admin/pricing', icon: DollarSign, label: 'pricing', count: null },
  { href: '/admin/finance', icon: CreditCard, label: 'finance', count: '3' },
  { href: '/admin/reports', icon: FileText, label: 'reports', count: null },
  { href: '/admin/settings', icon: Settings, label: 'settings', count: null },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useI18nStore();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActivePath = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn("flex h-screen bg-background", isRTL && "rtl")}>
      {/* Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r",
        isRTL && "border-l border-r-0"
      )}>
        <div className="flex items-center h-16 px-6 border-b">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('admin_dashboard')}</h2>
              <p className="text-xs text-muted-foreground">{t('toll_management')}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActivePath(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-5 h-5", isRTL ? "ml-3" : "mr-3")} />
              <span className="flex-1">{t(item.label as any)}</span>
              {item.count && (
                <Badge variant="secondary" className="ml-auto rtl:mr-auto rtl:ml-0">
                  {item.count}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium">{t('system_status')}</p>
                <p className="text-xs text-green-600">{t('all_systems_operational')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className={cn(
            "fixed inset-y-0 w-64 bg-card border-r shadow-lg",
            isRTL ? "right-0 border-l border-r-0" : "left-0"
          )}>
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <h2 className="text-lg font-semibold">{t('admin_dashboard')}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActivePath(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isRTL ? "ml-3" : "mr-3")} />
                  <span className="flex-1">{t(item.label as any)}</span>
                  {item.count && (
                    <Badge variant="secondary" className="ml-auto rtl:mr-auto rtl:ml-0">
                      {item.count}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn("flex-1", "lg:ml-64", isRTL && "lg:mr-64 lg:ml-0")}>
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-card border-b">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>{t('last_sync')}: {t('2_minutes_ago')}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}