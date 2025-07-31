
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-8 border-t border-slate-800">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
        <p>Powered by Gemini. For informational purposes only. Always bet responsibly.</p>
        <p>&copy; {new Date().getFullYear()} Elite Sports Intelligence. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
