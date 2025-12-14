import React, { useState, useRef } from 'react';
import { analyzeDocumentWithGemini } from '../services/geminiService';
import { KycSubmission, RiskLevel, KycStatus, User } from '../types';
import { Upload, Loader2, CheckCircle, XCircle, AlertTriangle, FileText, RefreshCw } from 'lucide-react';

interface VerificationProps {
  user: User;
  onSubmissionComplete: (submission: KycSubmission) => void;
  currentSubmission?: KycSubmission | null;
  onReset: () => void;
}

const Verification: React.FC<VerificationProps> = ({ user, onSubmissionComplete, currentSubmission, onReset }) => {
  const [formData, setFormData] = useState({ fullName: '', dob: '', gender: 'Male' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob || !file || !preview) {
      setError("Please fill all fields and upload a document.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // AI Analysis
      const analysis = await analyzeDocumentWithGemini(preview, formData);
      
      const newSubmission: KycSubmission = {
        id: Math.random().toString(36).substring(7),
        username: user.username,
        submittedAt: new Date().toISOString(),
        userProvided: { ...formData },
        documentImage: preview,
        aiAnalysis: analysis,
        status: KycStatus.PENDING
      };

      onSubmissionComplete(newSubmission);
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (currentSubmission) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 text-center">
            {currentSubmission.status === KycStatus.PENDING && (
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verification Pending</h2>
                    <p className="text-gray-400">Your document has been analyzed by AI and is awaiting admin approval.</p>
                </div>
            )}
            {currentSubmission.status === KycStatus.ACCEPTED && (
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verified Successfully</h2>
                    <p className="text-gray-400">Your identity has been confirmed.</p>
                </div>
            )}
            {currentSubmission.status === KycStatus.REJECTED && (
                <div className="flex flex-col items-center">
                     <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verification Rejected</h2>
                    <p className="text-gray-400 mb-6">Please review the issues and try again.</p>
                    <button 
                        onClick={onReset}
                        className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors shadow-lg shadow-purple-900/20"
                    >
                        <RefreshCw size={18} /> Try Again
                    </button>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/10">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        <FileText size={18}/> AI Analysis Result
                    </h3>
                    <div className="space-y-3">
                         <div className="flex justify-between">
                            <span className="text-gray-400">Detected Doc:</span>
                            <span className="text-white font-medium">{currentSubmission.aiAnalysis.documentData.docType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Risk Level:</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                                currentSubmission.aiAnalysis.riskLevel === RiskLevel.LOW ? 'bg-green-500/20 text-green-400' :
                                currentSubmission.aiAnalysis.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>{currentSubmission.aiAnalysis.riskLevel.toUpperCase()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-400">Fraud Score:</span>
                            <span className={`font-bold ${currentSubmission.aiAnalysis.fraudScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                                {currentSubmission.aiAnalysis.fraudScore}%
                            </span>
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                             <p className="text-sm text-gray-300 italic">"{currentSubmission.aiAnalysis.explanation}"</p>
                        </div>
                    </div>
                </div>
                
                 <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/10">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Submitted Details</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">{currentSubmission.userProvided.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">DOB:</span>
                            <span className="text-white">{currentSubmission.userProvided.dob}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-1">Uploaded Document:</p>
                            <img src={currentSubmission.documentImage} alt="Uploaded ID" className="w-full h-32 object-cover rounded-lg border border-gray-700" />
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
                    Start Verification
                </h2>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-200">
                        <AlertTriangle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="As per ID document"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Upload Identity Document</label>
                        <div 
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                preview ? 'border-purple-500 bg-purple-500/5' : 'border-gray-700 hover:border-purple-400 hover:bg-slate-800'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {preview ? (
                                <div className="relative w-full h-48">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                        <p className="text-white font-medium">Click to change</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                                        <Upload className="text-purple-400" size={24} />
                                    </div>
                                    <p className="text-white font-medium">Click to upload or drag and drop</p>
                                    <p className="text-gray-500 text-sm mt-1">Aadhaar, PAN, or Driving License</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin" />
                                AI Analyzing...
                            </>
                        ) : (
                            'Submit for Verification'
                        )}
                    </button>
                </form>
            </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
             <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">How it works</h3>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                        <p className="text-sm text-gray-400">Upload a clear photo of your government-issued ID.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                        <p className="text-sm text-gray-400">Gemini AI extracts data and cross-references it with your input.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                        <p className="text-sm text-gray-400">A risk score is generated to prevent fraud.</p>
                    </li>
                </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/10 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-2">Privacy First</h3>
                 <p className="text-sm text-gray-400">Your documents are processed securely and only used for identity verification.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;