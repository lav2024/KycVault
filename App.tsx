import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Login, Register, ForgotPassword } from './components/Auth';
import Verification from './components/Verification';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import { User, Role, KycSubmission, KycStatus, RiskLevel } from './types';
import { ShieldCheck, ArrowRight, LayoutDashboard, Shield } from 'lucide-react';

// --- MOCK DATA FOR DEMO PURPOSES ---
const MOCK_SUBMISSIONS: KycSubmission[] = [
  {
    id: '1',
    username: 'abi_2004',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userProvided: { fullName: 'Abi', dob: '2004-01-01', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+Card+-+Abi', 
    aiAnalysis: {
      documentData: {
        extractedName: 'Abi',
        extractedDob: '01/01/2004',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '0000 1111 2222',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 2,
      explanation: 'Data matches perfectly. ID appears valid.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '2',
    username: 'aarav_mehta',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userProvided: { fullName: 'Aarav Mehta', dob: '1990-05-20', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=PAN+Card+-+Aarav',
    aiAnalysis: {
      documentData: {
        extractedName: 'Aarav Mehta',
        extractedDob: 'NA', // PAN sometimes has different format or OCR miss
        extractedGender: 'Male',
        docType: 'PAN Card',
        docNumber: 'ECTXX4515G',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 5,
      explanation: 'PAN Validated. Name matches.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '3',
    username: 'priya_sharma',
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    userProvided: { fullName: 'Priya Sharma', dob: '1988-09-08', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=DL+-+Priya+Sharma',
    aiAnalysis: {
      documentData: {
        extractedName: 'Priya Sharma',
        extractedDob: '08/09/1988',
        extractedGender: 'Female',
        docType: 'Driving License',
        docNumber: 'HR0820200078901',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 0,
      explanation: 'Clear document, verified against database.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '4',
    username: 'reina_k',
    submittedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    userProvided: { fullName: 'Reina Kapoor', dob: '1992-09-05', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Reina',
    aiAnalysis: {
      documentData: {
        extractedName: 'Reina Kapoor',
        extractedDob: '05/09/1992',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '9087 7234 5678',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 1,
      explanation: 'Identity verified successfully.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '5',
    username: 'rohan_kumar',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    userProvided: { fullName: 'Rohan Kumar', dob: '1992-03-15', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Rohan',
    aiAnalysis: {
      documentData: {
        extractedName: 'Rohan Kumar',
        extractedDob: '15/03/1992',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '3456 7890 1234',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 3,
      explanation: 'No issues found.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '6',
    username: 'deepak_ahuja',
    submittedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userProvided: { fullName: 'Deepak Ahuja', dob: '1987-07-12', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Deepak',
    aiAnalysis: {
      documentData: {
        extractedName: 'Deepak Ahuja',
        extractedDob: '12/07/1987',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '2466 1357 9024',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 4,
      explanation: 'Valid document.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '7',
    username: 'sanjev_k',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    userProvided: { fullName: 'Sanjev Kumar', dob: '1980-01-01', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Sanjev',
    aiAnalysis: {
      documentData: {
        extractedName: 'Sanjev Kumar',
        extractedDob: '03/05/1982',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '3456 7890 1234',
        matchStatus: { name: true, dob: false, gender: true }
      },
      riskLevel: RiskLevel.HIGH,
      fraudScore: 88,
      explanation: 'Significant DOB mismatch (User: 1980, Doc: 1982). Potential fraud.'
    },
    status: KycStatus.REJECTED
  },
  {
    id: '8',
    username: 'aisha_khan',
    submittedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    userProvided: { fullName: 'Aisha Khan', dob: '1990-12-03', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Aisha',
    aiAnalysis: {
      documentData: {
        extractedName: 'Aisha Khan',
        extractedDob: '03/12/1990',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '3456 7890 1210',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 8,
      explanation: 'Minor date format difference, otherwise valid.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '9',
    username: 'sanjay_reddy',
    submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    userProvided: { fullName: 'Sanjay Reddy', dob: '1978-08-29', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Sanjay',
    aiAnalysis: {
      documentData: {
        extractedName: 'Sanjay Reddy',
        extractedDob: '29/08/1978',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '5432 5098 7654',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 1,
      explanation: 'Verified successfully.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '10',
    username: 'divya_singh',
    submittedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userProvided: { fullName: 'Divya Singh', dob: '1995-10-14', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Divya',
    aiAnalysis: {
      documentData: {
        extractedName: 'Divya Singh',
        extractedDob: '14/10/1995',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '0987 6543 2109',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 0,
      explanation: 'Perfect match.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '11',
    username: 'gautam_sharma',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    userProvided: { fullName: 'Gautam Sharma', dob: '1985-03-05', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Gautam',
    aiAnalysis: {
      documentData: {
        extractedName: 'Gautam Sharma',
        extractedDob: '05/03/1985',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '6017 9934 8211',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 2,
      explanation: 'Verified.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '12',
    username: 'nisha_desai',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    userProvided: { fullName: 'Nisha Desai', dob: '1993-06-12', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Nisha',
    aiAnalysis: {
      documentData: {
        extractedName: 'Nisha Desai',
        extractedDob: '12/06/1993',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '9012 3456 7890',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 1,
      explanation: 'All fields match.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '13',
    username: 'vikram_y',
    submittedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    userProvided: { fullName: 'Vikram Yadav', dob: '1982-05-03', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Viikam',
    aiAnalysis: {
      documentData: {
        extractedName: 'Viikam Yadav', // Intentionally misspelled in doc
        extractedDob: '03/05/1982',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '6543 4209 8765',
        matchStatus: { name: false, dob: true, gender: true }
      },
      riskLevel: RiskLevel.MEDIUM,
      fraudScore: 35,
      explanation: 'Name mismatch: "Vikram" vs "Viikam". Possible OCR error or typo in document.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '14',
    username: 'priya_singh',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    userProvided: { fullName: 'Priya Singh', dob: '1990-02-19', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Priya+S',
    aiAnalysis: {
      documentData: {
        extractedName: 'Priya Singh',
        extractedDob: '19/02/1990',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '8765 4321 0987',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 3,
      explanation: 'Verified.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '15',
    username: 'rajesh_kumar',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    userProvided: { fullName: 'Rajesh Kumar', dob: '1975-07-07', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Rajesh',
    aiAnalysis: {
      documentData: {
        extractedName: 'Rajash Kumar', // Typo in doc "Rajash"
        extractedDob: '07/07/1975',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '1234 5678 9012',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.MEDIUM,
      fraudScore: 15,
      explanation: 'Minor name discrepancy (Rajesh vs Rajash). Likely acceptable.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '16',
    username: 'sneha_sharma',
    submittedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    userProvided: { fullName: 'Sneha Sharma', dob: '1998-11-27', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Sneha',
    aiAnalysis: {
      documentData: {
        extractedName: 'Sneha Sharma',
        extractedDob: '27/11/1998',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '6789 7123 4567',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 0,
      explanation: 'Identity confirmed.'
    },
    status: KycStatus.PENDING
  },
  {
    id: '17',
    username: 'rakesh_kumar',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    userProvided: { fullName: 'Rakesh Kumar', dob: '1988-07-25', gender: 'Male' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Rakesh',
    aiAnalysis: {
      documentData: {
        extractedName: 'Rakesh Kumar',
        extractedDob: '25/07/1988',
        extractedGender: 'Male',
        docType: 'Aadhaar Card',
        docNumber: '3109 8865 4321',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 2,
      explanation: 'Verified.'
    },
    status: KycStatus.ACCEPTED
  },
  {
    id: '18',
    username: 'pooja_sharma',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    userProvided: { fullName: 'Pooja Sharma', dob: '1991-11-03', gender: 'Female' },
    documentImage: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Aadhaar+-+Pooja',
    aiAnalysis: {
      documentData: {
        extractedName: 'Pooja Sharma',
        extractedDob: '03/11/1991',
        extractedGender: 'Female',
        docType: 'Aadhaar Card',
        docNumber: '5678 7894 9012',
        matchStatus: { name: true, dob: true, gender: true }
      },
      riskLevel: RiskLevel.LOW,
      fraudScore: 1,
      explanation: 'Verified.'
    },
    status: KycStatus.ACCEPTED
  }
];

// Initial mock users "database"
const INITIAL_USERS: User[] = [
    { username: 'Lav', password: 'asd123', role: Role.ADMIN, email: 'admin@kycvault.com' },
    { username: 'Lavanya', password: 'qwerty', role: Role.USER, email: 'lavanya@example.com' }
];

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="relative isolate flex flex-col min-h-[calc(100vh-64px)] justify-center">
     {/* Hero Section */}
     <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center z-10">
        <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex justify-center">
               <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-purple-400 ring-1 ring-inset ring-purple-400/30 bg-purple-400/10">
                 🚀 AI Powered KYC Detection
               </div>
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Detect Identity Verification in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Seconds</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Verify the authenticity of KYC documents with state-of-the-art AI analysis. 
              Reduce fraud, automate workflows, and ensure compliance instantly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                onClick={onStart}
                className="rounded-full bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight size={16}/>
              </button>
              <button className="text-sm font-semibold leading-6 text-white hover:text-purple-300 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
        </div>
     </div>
     
     {/* Abstract visual background */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 overflow-hidden w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
     </div>

     {/* Footer */}
     <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-purple-900/30 bg-slate-900/30 backdrop-blur-sm mt-auto z-20 absolute bottom-0">
        <p>AI-verify @ copyright 2026 preserved and its for education-purpose only</p>
     </footer>
  </div>
);

const UserHome = ({ user, onStartVerification, onAdminDashboard }: { user: User, onStartVerification: () => void, onAdminDashboard: () => void }) => (
  <div className="relative isolate flex flex-col min-h-[calc(100vh-64px)]">
     <div className="flex-grow mx-auto max-w-7xl px-6 pt-10 lg:flex lg:px-8 items-center justify-center">
        <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">{user.username}</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {user.role === Role.ADMIN 
                ? "Access the administrative dashboard to review submissions and analyze fraud risks."
                : "Proceed with your identity verification securely using our AI-powered system."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {user.role === Role.USER && (
                <button 
                  onClick={onStartVerification}
                  className="w-full sm:w-auto rounded-full bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                >
                  Start Verification <ShieldCheck size={18}/>
                </button>
              )}
              
              {user.role === Role.ADMIN && (
                <button 
                    onClick={onAdminDashboard}
                    className="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                    Admin View <LayoutDashboard size={18}/>
                </button>
              )}
            </div>
        </div>
        
         {/* Abstract visual background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
             <div className="w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>
     </div>
     <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-purple-900/30 bg-slate-900/30 backdrop-blur-sm mt-auto">
        <p>AI-verify @ copyright 2026 preserved and its for education-purpose only</p>
     </footer>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [submissions, setSubmissions] = useState<KycSubmission[]>(MOCK_SUBMISSIONS);
  const [userSubmission, setUserSubmission] = useState<KycSubmission | null>(null);

  // --- Auth Handlers ---

  const handleAuthenticate = (username: string, password: string, role: Role): User | null => {
      const foundUser = users.find(u => u.username === username && u.role === role);
      if (foundUser && foundUser.password === password) {
          return foundUser;
      }
      return null;
  };

  const handleRegisterMock = (newUser: User & {password: string}): boolean => {
      if (users.some(u => u.username === newUser.username || u.email === newUser.email)) {
          return false; // User exists
      }
      setUsers([...users, newUser]);
      return true;
  };

  const handleResetPassword = (email: string, newPass: string): boolean => {
      setUsers(prevUsers => prevUsers.map(u => 
          u.email === email ? { ...u, password: newPass } : u
      ));
      return true;
  };

  const checkEmailExists = (email: string): boolean => {
      return users.some(u => u.email === email);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Find previous submission for this specific user
    const existing = submissions.find(s => s.username === loggedInUser.username);
    setUserSubmission(existing || null);
    
    // Redirect to User Home instead of direct dashboard/verification
    setCurrentPage('user-home');
  };

  const handleLogout = () => {
    setUser(null);
    setUserSubmission(null);
    setCurrentPage('landing');
  };

  const handleSubmissionComplete = (submission: KycSubmission) => {
    setSubmissions([submission, ...submissions]);
    setUserSubmission(submission);
  };

  const handleStatusUpdate = (id: string, status: KycStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (userSubmission && userSubmission.id === id) {
        setUserSubmission(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (userSubmission && userSubmission.id === id) {
        setUserSubmission(null);
    }
  };

  const handleResetSubmission = () => {
    setUserSubmission(null);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-gray-100 font-sans selection:bg-purple-500/30">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'landing' && (
          <LandingPage onStart={() => setCurrentPage('login')} />
        )}

        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin} 
            onNavigate={setCurrentPage} 
            onAuthenticate={handleAuthenticate}
          />
        )}

        {currentPage === 'register' && (
          <Register 
            onLogin={handleLogin} 
            onNavigate={setCurrentPage} 
            onRegister={handleRegisterMock}
          />
        )}

        {currentPage === 'forgot-password' && (
           <ForgotPassword 
                onNavigate={setCurrentPage} 
                onLogin={handleLogin} // Not used but required by type
                checkEmailExists={checkEmailExists}
                onResetPassword={handleResetPassword}
           />
        )}

        {/* New User Home Page */}
        {currentPage === 'user-home' && user && (
           <UserHome 
              user={user} 
              onStartVerification={() => setCurrentPage('verification')}
              onAdminDashboard={() => setCurrentPage('admin-dashboard')}
           />
        )}
        
        {/* User Profile Page */}
        {currentPage === 'profile' && user && (
           <UserProfile 
              user={user} 
              submission={userSubmission}
              onBack={() => setCurrentPage('user-home')}
           />
        )}

        {/* Verification Page (formerly 'home' for user) */}
        {currentPage === 'verification' && user && (
          <Verification 
            user={user} 
            onSubmissionComplete={handleSubmissionComplete}
            currentSubmission={userSubmission}
            onReset={handleResetSubmission}
          />
        )}

        {currentPage === 'admin-dashboard' && user && user.role === Role.ADMIN && (
          <AdminDashboard 
            submissions={submissions}
            onUpdateStatus={handleStatusUpdate}
            onDelete={handleDeleteSubmission}
          />
        )}
      </main>
    </div>
  );
};

export default App;