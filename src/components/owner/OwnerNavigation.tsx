import {
  Buildings,
  ChartLineUp,
  CurrencyDollar,
  ShieldCheck,
  Gear,
  Users,
  TrendUp
} from "phosphor-react";

interface OwnerNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Portfolio Overview', icon: Buildings },
  { id: 'analytics', label: 'Corporate Analytics', icon: ChartLineUp },
  { id: 'financial', label: 'Financial Center', icon: CurrencyDollar },
  { id: 'security', label: 'Enterprise Security', icon: ShieldCheck },
  { id: 'administration', label: 'Platform Admin', icon: Gear },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'growth', label: 'Growth Center', icon: TrendUp }
];

export default function OwnerNavigation({ activeTab, onTabChange }: OwnerNavigationProps) {
  return (
    <nav className="bg-white/60 backdrop-blur-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
