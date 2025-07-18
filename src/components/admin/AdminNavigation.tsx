import { 
  ChartBar, 
  Users, 
  CurrencyDollar, 
  Gear 
} from "phosphor-react";

const tabs = [
  { id: 'overview', label: 'Location Overview', icon: ChartBar },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'financial', label: 'Financial Reports', icon: CurrencyDollar },
  { id: 'settings', label: 'Location Settings', icon: Gear }
];

interface AdminNavigationProps {
  readonly activeTab: string;
  readonly onTabChange: (tab: string) => void;
}

export default function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  return (
    <nav className="bg-white/60 backdrop-blur-sm border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
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
