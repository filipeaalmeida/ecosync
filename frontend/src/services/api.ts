interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface ApiOptions extends RequestInit {
  token?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function apiCall<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
    
    // Se receber 401, redireciona para login
    if (response.status === 401) {
      window.location.href = '/login';
      return {
        status: 401,
        error: 'Não autorizado',
      };
    }
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }
    
    if (!response.ok) {
      return {
        status: response.status,
        error: data?.detail || `Erro ${response.status}: ${response.statusText}`,
        data,
      };
    }
    
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    return {
      status: 0,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}