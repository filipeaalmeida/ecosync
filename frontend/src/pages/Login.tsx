import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log('Login:', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Box com logo */}
        <div className="bg-white p-6 rounded-t-2xl shadow-xl w-full flex items-center justify-center gap-3">
          <div className="size-10 text-gray-900">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">EcoSync</h2>
        </div>
        
        {/* Box de login */}
        <div className="bg-white p-8 rounded-b-2xl shadow-xl w-full border-t border-gray-100">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-gray-700 text-center mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600 text-center text-sm">
              Faça login para acessar sua conta
            </p>
          </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">
                Lembrar de mim
              </span>
            </label>
            
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 transition"
              onClick={() => console.log('Recuperar senha')}
            >
              Esqueceu a senha?
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02]"
          >
            Entrar
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
              onClick={() => console.log('Cadastrar')}
            >
              Cadastre-se
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;