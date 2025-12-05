import React from 'react';

export default function Footer(){
  return (
    <footer className='text-center py-6 border-t bg-white'>
      <p>© {new Date().getFullYear()} Packers & Movers. All rights reserved.</p>
    </footer>
  );
}

