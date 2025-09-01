import { useState } from 'react';
import { User, Mail, UserCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

// Define proper types
interface CommunicationItem {
  id: string;
  title: string;
  referenceNumber: string;
  type: 'Referral' | 'Letter';
  team: 'Far North' | 'Central West';
  dateReceived: string;
  daysSinceReceived: number;
  status: 'Awaiting Action' | 'Actioned';
  isOverdue: boolean;
  overdueDays?: number;
  icon: 'user' | 'mail';
}

// Sample data matching your PDF
const communicationItems: CommunicationItem[] = [
  {
    id: '086',
    title: 'Referral for John Barnes',
    referenceNumber: '086',
    type: 'Referral',
    team: 'Far North',
    dateReceived: '16 Aug 2025',
    daysSinceReceived: 2,
    status: 'Awaiting Action',
    isOverdue: false,
    icon: 'user'
  },
  {
    id: '082',
    title: 'Message from Dr Marta Lang',
    referenceNumber: '082',
    type: 'Letter',
    team: 'Far North',
    dateReceived: '16 Aug 2025',
    daysSinceReceived: 2,
    status: 'Awaiting Action',
    isOverdue: false,
    icon: 'mail'
  },
  {
    id: '071',
    title: 'Message from NP Kaye Fox',
    referenceNumber: '071',
    type: 'Letter',
    team: 'Central West',
    dateReceived: '12 Aug 2025',
    daysSinceReceived: 7,
    status: 'Awaiting Action',
    isOverdue: false,
    icon: 'mail'
  },
  {
    id: '068',
    title: 'Referral for Casey Shackleton',
    referenceNumber: '068',
    type: 'Referral',
    team: 'Far North',
    dateReceived: '11 Aug 2025',
    daysSinceReceived: 8,
    status: 'Awaiting Action',
    isOverdue: true,
    overdueDays: 1,
    icon: 'user'
  },
  {
    id: '067',
    title: 'Message from Dr Harry McKinnon',
    referenceNumber: '067',
    type: 'Letter',
    team: 'Central West',
    dateReceived: '11 Aug 2025',
    daysSinceReceived: 8,
    status: 'Awaiting Action',
    isOverdue: true,
    overdueDays: 1,
    icon: 'mail'
  },
  {
    id: '041',
    title: 'Referral for Jasmine Groff',
    referenceNumber: '041',
    type: 'Referral',
    team: 'Central West',
    dateReceived: '27 July 2025',
    daysSinceReceived: 23,
    status: 'Awaiting Action',
    isOverdue: true,
    overdueDays: 16,
    icon: 'user'
  }
];

const actionedItems: CommunicationItem[] = communicationItems.map(item => ({
  ...item,
  status: 'Actioned' as const
}));

function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState<'requiring-action' | 'actioned'>('requiring-action');
  const [selectedItem, setSelectedItem] = useState<CommunicationItem | null>(null);

  const getStatusColor = (item: CommunicationItem): string => {
    if (item.status === 'Actioned') return 'bg-green-600';
    if (item.isOverdue) return 'bg-red-600';
    return 'bg-blue-600';
  };

  const getStatusBadge = (item: CommunicationItem) => {
    if (item.status === 'Actioned') {
      return (
        <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
          Actioned
        </span>
      );
    }
    if (item.isOverdue) {
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
            Awaiting Action
          </span>
          <span className="text-xs text-orange-600 font-medium mt-1">
            OVERDUE {item.overdueDays} DAY{(item.overdueDays && item.overdueDays > 1) ? 'S' : ''}
          </span>
        </div>
      );
    }
    return (
      <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
        Awaiting Action
      </span>
    );
  };

  const getIcon = (iconType: 'user' | 'mail') => {
    const iconClass = `w-6 h-6 text-white`;
    if (iconType === 'user') return <User className={iconClass} />;
    if (iconType === 'mail') return <Mail className={iconClass} />;
    return <User className={iconClass} />;
  };

  const currentItems = activeTab === 'requiring-action' ? communicationItems : actionedItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('requiring-action')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'requiring-action'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Items Requiring Action
                </button>
                <button
                  onClick={() => setActiveTab('actioned')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'actioned'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Actioned Items
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-gray-600" />
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Eleanor Burns</div>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Incoming Communication Dashboard
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {activeTab === 'requiring-action' ? 'Items Requiring Action' : 'Actioned Items'}
          </h2>
        </div>

        {/* Communication Items Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reference Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Team</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Received</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Days Since Received</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(item)}`}>
                          {getIcon(item.icon)}
                        </div>
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.referenceNumber}</td>
                    <td className="px-6 py-4 text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 text-gray-900">{item.team}</td>
                    <td className="px-6 py-4 text-gray-900">{item.dateReceived}</td>
                    <td className="px-6 py-4 text-gray-900">{item.daysSinceReceived}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Requiring Action</p>
                <p className="text-2xl font-bold text-blue-600">{communicationItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {communicationItems.filter(item => item.isOverdue).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Actioned</p>
                <p className="text-2xl font-bold text-green-600">{actionedItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-purple-600">
                  {communicationItems.length + actionedItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedItem.title}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Reference:</span>
                  <p>{selectedItem.referenceNumber}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Type:</span>
                  <p>{selectedItem.type}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Team:</span>
                  <p>{selectedItem.team}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date Received:</span>
                  <p>{selectedItem.dateReceived}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Days Since Received:</span>
                  <p>{selectedItem.daysSinceReceived}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <p>{selectedItem.status}</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                {selectedItem.status !== 'Actioned' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Mark as Actioned
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunicationDashboard;