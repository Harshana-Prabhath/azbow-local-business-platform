"use client";
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Search, Store, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'user' | 'business' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const role = userType ==="business"?'OWNER':"USER";

    const response = await fetch('/api/register',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,password, role}),
    })

    const data = await response.json();

    if(!response.ok){
        throw new Error("Registration failed");
    }else {
        router.push('/login?success=Account created! Please sign in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-md">
       
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a8a] rounded-2xl mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Azbow</h1>
        </div>

     
        <div className="bg-white rounded-2xl shadow-xl p-8">
         
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join the local business ecosystem</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 text-black py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

           
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 text-black border rounded-lg focus:ring-2 outline-none transition-all ${
                    passwordError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#1e3a8a] focus:border-transparent'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                    userType === 'user'
                      ? 'border-[#1e3a8a] bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                        userType === 'user' ? 'bg-[#1e3a8a]' : 'bg-gray-100'
                      }`}
                    >
                      <Search
                        className={`w-7 h-7 ${
                          userType === 'user' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`font-semibold ${userType === 'user' ? 'text-[#1e3a8a]' : 'text-gray-900'}`}>
                        Regular User
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        I want to discover businesses
                      </p>
                    </div>
                  </div>
                  {userType === 'user' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

               
                <button
                  type="button"
                  onClick={() => setUserType('business')}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                    userType === 'business'
                      ? 'border-[#1e3a8a] bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                        userType === 'business' ? 'bg-[#1e3a8a]' : 'bg-gray-100'
                      }`}
                    >
                      <Store
                        className={`w-7 h-7 ${
                          userType === 'business' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`font-semibold ${userType === 'business' ? 'text-[#1e3a8a]' : 'text-gray-900'}`}>
                        Business Owner
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        I want to list my business
                      </p>
                    </div>
                  </div>
                  {userType === 'business' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

           
            <button
              type="submit"
              disabled={isLoading || !userType || !!passwordError}
              className="w-full bg-[#1e3a8a] text-white py-3.5 rounded-lg font-semibold hover:bg-[#1e3a8a]/90 focus:ring-4 focus:ring-[#1e3a8a]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1e3a8a] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}