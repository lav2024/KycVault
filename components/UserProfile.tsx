import React from 'react';
import { User, KycSubmission, KycStatus } from '../types';
import { User as UserIcon, Mail, Lock, FileText, CheckCircle, XCircle, Clock, ArrowLeft, Shield } from 'lucide-react';

interface UserProfileProps {
  user: User;
  submission: KycSubmission | null;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, submission, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Details Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <UserIcon size={40} className="text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
             <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
               {user.role}
             </span>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 space-y-4">
             <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Account Info</h3>
             
             <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><UserIcon size={12}/> Username</label>
                <div className="text-gray-200 bg-slate-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                  {user.username}
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Mail size={12}/> Email</label>
                <div className="text-gray-200 bg-slate-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                  {user.email || 'No email provided'}
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Lock size={12}/> Password</label>
                <div className="text-gray-200 bg-slate-800/50 px-3 py-2 rounded-lg border border-gray-700/50 font-mono tracking-widest text-sm">
                  ••••••••••••
                </div>
             </div>
          </div>
        </div>

        {/* Documents Column */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 min-h-[400px]">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <FileText className="text-purple-400" /> Uploaded Documents
              </h3>

              {submission ? (
                <div className="space-y-6">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                        submission.status === KycStatus.ACCEPTED ? 'bg-green-500/10 border-green-500/30' :
                        submission.status === KycStatus.REJECTED ? 'bg-red-500/10 border-red-500/30' :
                        'bg-yellow-500/10 border-yellow-500/30'
                    }`}>
                        <div className={`p-2 rounded-full ${
                             submission.status === KycStatus.ACCEPTED ? 'bg-green-500/20 text-green-400' :
                             submission.status === KycStatus.REJECTED ? 'bg-red-500/20 text-red-400' :
                             'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {submission.status === KycStatus.ACCEPTED ? <CheckCircle size={24}/> : 
                             submission.status === KycStatus.REJECTED ? <XCircle size={24}/> : <Clock size={24}/>}
                        </div>
                        <div>
                            <h4 className={`font-bold ${
                                 submission.status === KycStatus.ACCEPTED ? 'text-green-400' :
                                 submission.status === KycStatus.REJECTED ? 'text-red-400' :
                                 'text-yellow-400'
                            }`}>
                                Verification {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).toLowerCase()}
                            </h4>
                            <p className="text-sm text-gray-400">
                                Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Document Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400">Document Image</h4>
                            <div className="rounded-xl overflow-hidden border border-gray-700 bg-slate-800">
                                <img src={submission.documentImage} alt="Uploaded Doc" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-sm font-medium text-gray-400">Extracted Details</h4>
                             <div className="bg-slate-800 rounded-xl p-4 border border-gray-700 space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-500">Doc Type</span>
                                    <span className="text-white font-medium">{submission.aiAnalysis.documentData.docType}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-500">Name</span>
                                    <span className="text-white">{submission.aiAnalysis.documentData.extractedName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-500">DOB</span>
                                    <span className="text-white">{submission.aiAnalysis.documentData.extractedDob}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Doc No</span>
                                    <span className="text-white">{submission.aiAnalysis.documentData.docNumber}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-700 rounded-xl bg-slate-800/20">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-gray-600">
                        <Shield size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white">No Documents Found</h3>
                    <p className="text-gray-400 max-w-xs mt-2">You haven't uploaded any verification documents yet.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
