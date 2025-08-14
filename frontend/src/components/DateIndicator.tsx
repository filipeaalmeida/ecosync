import React from 'react';

interface DateIndicatorProps {
  date: string;
}

const DateIndicator: React.FC<DateIndicatorProps> = ({ date }) => {
  const checkDateStatus = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'expired';
    } else if (diffDays <= 30) {
      return 'warning';
    }
    return 'normal';
  };

  const status = checkDateStatus(date);
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#49739c] text-sm">{date}</span>
      {status === 'expired' && (
        <div className="group relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ef4444" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
          </svg>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Prazo vencido
          </div>
        </div>
      )}
      {status === 'warning' && (
        <div className="group relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#eab308" viewBox="0 0 256 256">
            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
          </svg>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Vence em 30 dias ou menos
          </div>
        </div>
      )}
    </div>
  );
};

export default DateIndicator;