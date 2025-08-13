import React, { useState } from 'react';
import Header from '../components/Header';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log('Login:', { username, password, rememberMe });
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#0d141c] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Welcome back
            </h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Username</p>
                <input
                  placeholder="Enter your username"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-14 placeholder:text-[#49739c] p-[15px] text-base font-normal leading-normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">Password</p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-14 placeholder:text-[#49739c] p-[15px] text-base font-normal leading-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-14 justify-between">
              <p className="text-[#0d141c] text-base font-normal leading-normal flex-1 truncate">Remember me</p>
              <div className="shrink-0">
                <div className="flex size-7 items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-[#cedbe8] border-2 bg-transparent text-[#0b72da] checked:bg-[#0b72da] checked:border-[#0b72da] focus:ring-0 focus:ring-offset-0 focus:border-[#cedbe8] focus:outline-none"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </div>
              </div>
            </div>
            <p className="text-[#49739c] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline cursor-pointer">
              Forgot password?
            </p>
            <div className="flex px-4 py-3">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#0b72da] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleLogin}
              >
                <span className="truncate">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;