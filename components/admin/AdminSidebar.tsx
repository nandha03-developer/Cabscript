"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaShoppingCart, 
  FaEnvelope, 
  FaUsers, 
  FaChartLine,
  FaNewspaper,
  FaCog
} from 'react-icons/fa';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/crads/dashboard', icon: FaHome },
  { name: 'Orders', href: '/crads/orders', icon: FaShoppingCart },
  { name: 'Customers', href: '/crads/customers', icon: FaUsers },
  { name: 'Newsletter', href: '/crads/newsletter', icon: FaNewspaper },
  { name: 'Demo Requests', href: '/crads/demo-requests', icon: FaEnvelope },
  { name: 'Activity Logs', href: '/crads/activity-logs', icon: FaChartLine },
  { name: 'Settings', href: '/crads/settings', icon: FaCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/crads/dashboard" className="flex items-center gap-3">
          <div className="bg-[#FFD300] p-2 rounded-lg">
            <span className="text-2xl font-bold text-gray-900">CS</span>
          </div>
          <div>
            <div className="text-white font-bold text-lg">CabScript</div>
            <div className="text-gray-400 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[#FFD300] text-gray-900 font-semibold' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>CabScript Admin v1.0</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
