import React, { useState } from 'react';
import { User, Role } from '../types';
import { Lock, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

const RoleSelector = ({ role, setRole }: { role: Role, setRole: (r: Role) => void }) => (
  <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-purple-500/20">
    <button
      type="button"
      onClick={() => setRole(Role.USER)}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
        role === Role.USER 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <UserIcon size={16} /> User
    </button>
    <button
      type="button"
      onClick={() => setRole(Role.ADMIN)}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
        role === Role.ADMIN 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <ShieldAlert size={16} /> Admin
    </button>
  </div>
);

export const Login: React.FC<AuthProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Strict Credential Check
    if (role === Role.ADMIN) {
        if (username === 'Lav' && password === 'asd123') {
             onLogin({ 
                username: username, 
                role: role, 
                email: 'admin@kycvault.com' 
             });
        } else {
            setError('Wrong credentials');
        }
    } else if (role === Role.USER) {
        if (username === 'Lavanya' && password === 'qwerty') {
             onLogin({ 
                username: username, 
                role: role, 
                email: 'lavanya@example.com' 
             });
        } else {
             setError('Wrong credentials');
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-6">Select your role and sign in</p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <RoleSelector role={role} setRole={setRole} />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <button type="button" onClick={() => onNavigate('forgot-password')} className="text-xs text-purple-400 hover:text-purple-300">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Sign In as {role === Role.ADMIN ? 'Admin' : 'User'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} className="text-purple-400 hover:text-purple-300 font-medium">Register</button>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC<AuthProps> = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [role, setRole] = useState<Role>(Role.USER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Simulate Registration with selected role
    onLogin({ 
      username: formData.username, 
      role: role, 
      email: formData.email 
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Create Account</h2>
        <p className="text-center text-gray-400 mb-6">Select your role and join KycVault</p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <RoleSelector role={role} setRole={setRole} />

          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Register as {role === Role.ADMIN ? 'Admin' : 'User'}
          </button>
        </form>
         <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-purple-400 hover:text-purple-300 font-medium">Login</button>
        </div>
      </div>
    </div>
  );
};