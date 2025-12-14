import React, { useState } from 'react';
import { KycSubmission, KycStatus, RiskLevel } from '../types';
import { 
  Check, X, Eye, BarChart2, Users, FileText, AlertOctagon, 
  Download, Filter, ChevronDown, CheckCircle, XCircle, Trash2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

interface AdminDashboardProps {
  submissions: KycSubmission[];
  onUpdateStatus: (id: string, status: KycStatus) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions, onUpdateStatus, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'review' | 'analytics'>('review');
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | KycStatus>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Stats Calculation
  const totalUsers = submissions.length;
  const acceptedCount = submissions.filter(s => s.status === KycStatus.ACCEPTED).length;
  const rejectedCount = submissions.filter(s => s.status === KycStatus.REJECTED).length;
  const pendingCount = submissions.filter(s => s.status === KycStatus.PENDING).length;

  const docTypeData = React.useMemo(() => {
    const types: {[key: string]: number} = {};
    submissions.forEach(s => {
      const type = s.aiAnalysis.documentData.docType || 'Unknown';
      types[type] = (types[type] || 0) + 1;
    });
    return Object.keys(types).map(key => ({ name: key, value: types[key] }));
  }, [submissions]);

  const statusData = [
    { name: 'Accepted', value: acceptedCount },
    { name: 'Rejected', value: rejectedCount },
    { name: 'Pending', value: pendingCount },
  ];

  const handleExport = () => {
    const headers = ["Username,Name,DOB,Gender,DocType,Status,FraudScore,RiskLevel\n"];
    const rows = submissions.map(s => 
      `${s.username},${s.userProvided.fullName},${s.userProvided.dob},${s.userProvided.gender},${s.aiAnalysis.documentData.docType},${s.status},${s.aiAnalysis.fraudScore}%,${s.aiAnalysis.riskLevel}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kyc_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic - sort by newset first
  const filteredSubmissions = submissions
    .filter(s => {
        if (filterStatus === 'ALL') return true;
        return s.status === filterStatus;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const RenderReviewList = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Review Submissions</h2>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterStatus !== 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Filter size={16} /> 
                  {filterStatus === 'ALL' ? 'Filter Status' : filterStatus}
                  <ChevronDown size={14} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                      <button 
                        onClick={() => { setFilterStatus('ALL'); setIsFilterOpen(false); }} 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center justify-between ${filterStatus === 'ALL' ? 'text-white bg-slate-700' : 'text-gray-300'}`}
                      >
                        All Submissions
                        {filterStatus === 'ALL' && <Check size={14} />}
                      </button>
                      <button 
                        onClick={() => { setFilterStatus(KycStatus.PENDING); setIsFilterOpen(false); }} 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center justify-between ${filterStatus === KycStatus.PENDING ? 'text-yellow-400 bg-slate-700' : 'text-yellow-500/80'}`}
                      >
                        Pending
                        {filterStatus === KycStatus.PENDING && <Check size={14} />}
                      </button>
                      <button 
                        onClick={() => { setFilterStatus(KycStatus.ACCEPTED); setIsFilterOpen(false); }} 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center justify-between ${filterStatus === KycStatus.ACCEPTED ? 'text-green-400 bg-slate-700' : 'text-green-500/80'}`}
                      >
                        Accepted
                        {filterStatus === KycStatus.ACCEPTED && <Check size={14} />}
                      </button>
                      <button 
                        onClick={() => { setFilterStatus(KycStatus.REJECTED); setIsFilterOpen(false); }} 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center justify-between ${filterStatus === KycStatus.REJECTED ? 'text-red-400 bg-slate-700' : 'text-red-500/80'}`}
                      >
                        Rejected
                        {filterStatus === KycStatus.REJECTED && <Check size={14} />}
                      </button>
                  </div>
                )}
            </div>

             <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 text-purple-300 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-900/50 transition-colors">
              <Download size={16} /> Export CSV
            </button>
          </div>
       </div>

       {/* Scroll Hint for Mobile */}
       <div className="md:hidden flex justify-end mb-1">
         <span className="text-xs text-purple-400 italic animate-pulse flex items-center gap-1">
            Swipe to see more <ArrowRightIcon size={12} />
         </span>
       </div>

       <div className="overflow-x-auto bg-slate-900/50 border border-purple-500/20 rounded-xl backdrop-blur-sm pb-2 shadow-inner">
         <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-800/80 text-gray-400 text-sm uppercase">
                <th className="p-4 font-medium min-w-[150px]">User</th>
                <th className="p-4 font-medium min-w-[140px]">Document</th>
                <th className="p-4 font-medium min-w-[200px]">Extracted Data</th>
                <th className="p-4 font-medium min-w-[220px]">Risk Analysis</th>
                <th className="p-4 font-medium text-center min-w-[100px]">Status</th>
                <th className="p-4 font-medium text-right min-w-[160px]">Action</th>
                <th className="p-4 font-medium text-center min-w-[80px]">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSubmissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-white text-base">{item.userProvided.fullName}</div>
                    <div className="text-sm text-gray-500">{item.username}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-gray-300 px-3 py-1.5 rounded text-sm border border-gray-700 whitespace-nowrap">
                        {item.aiAnalysis.documentData.docType}
                    </span>
                  </td>
                  <td className="p-4">
                     <div className="text-sm text-gray-300 font-medium">
                        {item.aiAnalysis.documentData.extractedName}
                     </div>
                     <div className="text-xs text-gray-500 mt-1">
                        No: <span className="font-mono">{item.aiAnalysis.documentData.docNumber}</span>
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                         <div className={`w-2.5 h-2.5 rounded-full ${
                             item.aiAnalysis.riskLevel === RiskLevel.HIGH ? 'bg-red-500' :
                             item.aiAnalysis.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-500' : 'bg-green-500'
                         }`}></div>
                         <span className={`text-sm font-bold ${
                              item.aiAnalysis.riskLevel === RiskLevel.HIGH ? 'text-red-400' :
                              item.aiAnalysis.riskLevel === RiskLevel.MEDIUM ? 'text-yellow-400' : 'text-green-400'
                         }`}>{item.aiAnalysis.fraudScore}% Fraud Score</span>
                    </div>
                     <div className="text-xs text-gray-500 truncate max-w-[200px]" title={item.aiAnalysis.explanation}>
                        {item.aiAnalysis.explanation}
                     </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        item.status === KycStatus.ACCEPTED ? 'bg-green-500/20 text-green-400' :
                        item.status === KycStatus.REJECTED ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                    }`}>
                        {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === KycStatus.PENDING ? (
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => onUpdateStatus(item.id, KycStatus.ACCEPTED)}
                                className="p-3 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors active:scale-95" title="Accept"
                            >
                                <Check size={20} />
                            </button>
                            <button 
                                onClick={() => onUpdateStatus(item.id, KycStatus.REJECTED)}
                                className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors active:scale-95" title="Reject"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={() => setSelectedSubmission(item)}
                                className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors active:scale-95" title="View Details"
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                    ) : (
                         <button 
                                onClick={() => setSelectedSubmission(item)}
                                className="p-3 text-gray-500 hover:text-white transition-colors bg-slate-800/50 rounded-xl hover:bg-slate-700 active:scale-95"
                            >
                                <Eye size={20} />
                        </button>
                    )}
                  </td>
                  <td className="p-4 text-center">
                     <button 
                        onClick={() => onDelete(item.id)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors active:scale-95" 
                        title="Delete Submission"
                     >
                        <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                  <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                          {filterStatus === 'ALL' ? 'No submissions found.' : `No ${filterStatus.toLowerCase()} submissions found.`}
                      </td>
                  </tr>
              )}
            </tbody>
         </table>
       </div>
    </div>
  );

  const RenderAnalytics = () => (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white mb-6">Analytical Insights</h2>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-500" },
                { label: "Pending Reviews", value: pendingCount, icon: AlertOctagon, color: "bg-yellow-500" },
                { label: "Accepted", value: acceptedCount, icon: CheckCircle, color: "bg-green-500" },
                { label: "Rejected", value: rejectedCount, icon: XCircle, color: "bg-red-500" }
            ].map((stat, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-gray-700/50 p-6 rounded-xl flex items-center justify-between hover:border-purple-500/30 transition-all">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color} bg-white bg-opacity-5`}>
                        <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-gray-700/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-6">Verification Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-slate-800/50 border border-gray-700/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-6">Document Types</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={docTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {docTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#A78BFA', '#F472B6', '#34D399', '#60A5FA'][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Fraud Analysis List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-gray-700/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <AlertOctagon size={20}/> Highest Fraud Risk Cases
                </h3>
                <div className="space-y-4">
                    {submissions.sort((a,b) => b.aiAnalysis.fraudScore - a.aiAnalysis.fraudScore).slice(0, 3).map(s => (
                        <div key={s.id} className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-white font-medium">{s.userProvided.fullName}</span>
                                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold">{s.aiAnalysis.fraudScore}% Score</span>
                            </div>
                            <p className="text-xs text-gray-400">{s.aiAnalysis.explanation}</p>
                        </div>
                    ))}
                    {submissions.length === 0 && <p className="text-gray-500 text-sm">No data available.</p>}
                </div>
            </div>
            
             <div className="bg-slate-800/50 border border-gray-700/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle size={20}/> Lowest Fraud Risk Cases
                </h3>
                <div className="space-y-4">
                    {submissions.sort((a,b) => a.aiAnalysis.fraudScore - b.aiAnalysis.fraudScore).slice(0, 3).map(s => (
                         <div key={s.id} className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-white font-medium">{s.userProvided.fullName}</span>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">{s.aiAnalysis.fraudScore}% Score</span>
                            </div>
                            <p className="text-xs text-gray-400">{s.aiAnalysis.explanation}</p>
                        </div>
                    ))}
                     {submissions.length === 0 && <p className="text-gray-500 text-sm">No data available.</p>}
                </div>
            </div>
        </div>
    </div>
  );

  // Helper component for arrow since I can't import ArrowRight from lucide-react if not already imported
  // I need to add ArrowRight to the imports
  const ArrowRightIcon = ({ size }: { size: number }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-purple-500/30 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Submission Details</h3>
                    <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-white"><X size={24}/></button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">User Provided</h4>
                             <div className="bg-slate-800 p-3 rounded-lg space-y-2 text-sm text-gray-300">
                                <p><span className="text-gray-500">Name:</span> {selectedSubmission.userProvided.fullName}</p>
                                <p><span className="text-gray-500">DOB:</span> {selectedSubmission.userProvided.dob}</p>
                                <p><span className="text-gray-500">Gender:</span> {selectedSubmission.userProvided.gender}</p>
                             </div>
                        </div>
                        <div>
                             <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">AI Extracted</h4>
                              <div className="bg-slate-800 p-3 rounded-lg space-y-2 text-sm text-gray-300">
                                <p className={!selectedSubmission.aiAnalysis.documentData.matchStatus.name ? 'text-red-400' : ''}>
                                    <span className="text-gray-500">Name:</span> {selectedSubmission.aiAnalysis.documentData.extractedName}
                                </p>
                                <p className={!selectedSubmission.aiAnalysis.documentData.matchStatus.dob ? 'text-red-400' : ''}>
                                    <span className="text-gray-500">DOB:</span> {selectedSubmission.aiAnalysis.documentData.extractedDob}
                                </p>
                                <p>
                                    <span className="text-gray-500">Doc No:</span> {selectedSubmission.aiAnalysis.documentData.docNumber}
                                </p>
                             </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Fraud Analysis</h4>
                        <div className={`p-4 rounded-lg border ${
                            selectedSubmission.aiAnalysis.riskLevel === RiskLevel.HIGH ? 'bg-red-900/20 border-red-500/30' : 
                            selectedSubmission.aiAnalysis.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-green-900/20 border-green-500/30'
                        }`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-white">Fraud Score: {selectedSubmission.aiAnalysis.fraudScore}%</span>
                                <span className="font-bold uppercase">{selectedSubmission.aiAnalysis.riskLevel} Risk</span>
                            </div>
                            <p className="text-sm text-gray-300">{selectedSubmission.aiAnalysis.explanation}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Document Image</h4>
                        <img src={selectedSubmission.documentImage} className="w-full h-auto rounded-lg border border-gray-700" alt="Document ID" />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-800 bg-slate-800/30 flex justify-end gap-3">
                    {selectedSubmission.status === KycStatus.PENDING && (
                        <>
                             <button onClick={() => {onUpdateStatus(selectedSubmission.id, KycStatus.REJECTED); setSelectedSubmission(null)}} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Reject</button>
                             <button onClick={() => {onUpdateStatus(selectedSubmission.id, KycStatus.ACCEPTED); setSelectedSubmission(null)}} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Accept</button>
                        </>
                    )}
                     <button onClick={() => setSelectedSubmission(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium">Close</button>
                </div>
            </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'review' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText size={16} /> Review
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart2 size={16} /> Analytics
        </button>
      </div>

      {activeTab === 'review' ? <RenderReviewList /> : <RenderAnalytics />}
    </div>
  );
};

export default AdminDashboard;