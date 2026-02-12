'use client';
import { ReactNode, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Store, 
  Edit3, 
  Settings, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  Check,
  LayoutDashboard
} from 'lucide-react';
import MyBusinesses from '@/app/components/MyBusinesses';
import { useSession, signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface Business {
  id: number;
  name: string;
  category: string;
}

const navItems = [
  { name: 'Profile Overview', path: '/dashboard/:id', icon: Store },
  { name: 'Edit Business', path: '/dashboard/:id/edit', icon: Edit3 },
  { name: 'Service Management', path: '/dashboard/:id/services', icon: Settings },
  { name: 'Engagement Insights', path: '/dashboard/:id/insights', icon: BarChart3 },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = usePathname();
  const params = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;

  const getInitials = (name?: string | null) => {
    if (!name) return "U"; 
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return "U";
    
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase(); 
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const businesses: Business[] = [
    { id: 1, name: "Joe's Coffee Shop", category: "Food & Beverage" },
    { id: 2, name: "TechFix Solutions", category: "Technology" },
    { id: 3, name: "Bella's Boutique", category: "Retail" },
  ];

  const currentBusinessId = params.id ? parseInt(params.id as string) : businesses[0]?.id;
  const currentBusiness = businesses.find(b => b.id === currentBusinessId) || businesses[0];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-gray-900">Team Azbow</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

    
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        
        <aside
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            
            <div className="hidden lg:flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Team Azbow</h1>
                <p className="text-xs text-gray-500">Business Dashboard</p>
              </div>
            </div>

          
            {currentBusiness && (
              <div className="px-4 pt-4 pb-2 border-b border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {currentBusiness.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentBusiness.category}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 transition-transform ${
                      isBusinessDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                
                  {isBusinessDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <Link
                          href="/dashboard/businesses"
                          onClick={() => {
                            setIsBusinessDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-3 py-2 text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors mb-1"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="text-sm font-medium">View All Businesses</span>
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        {businesses.map((business) => (
                          <Link
                            key={business.id}
                            href={`/dashboard/${business.id}`}
                            onClick={() => {
                              setIsBusinessDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                              business.id === currentBusinessId
                                ? 'bg-blue-50 text-[#1e3a8a]'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{business.name}</p>
                              <p className="text-xs text-gray-500 truncate">{business.category}</p>
                            </div>
                            {business.id === currentBusinessId && (
                              <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.path.replace(':id', currentBusinessId.toString());
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path.replace(':id', currentBusinessId.toString())}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#1e3a8a] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            
            <div className="border-t border-gray-200 px-4 py-4">
              {loading ? (
                <div className="flex items-center space-x-3 px-4 py-3 mb-2 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>):(
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                      <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          
                          {getInitials(user?.name || user?.email || "?")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.role === 'OWNER' ? 'Business Owner' : 'Regular User'}
                        </p>
                      </div>
                    </div>
                    )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
           <MyBusinesses/>
          </div>
        </main>
      </div>
    </div>
  );
}