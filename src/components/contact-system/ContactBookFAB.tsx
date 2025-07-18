import React from 'react';
import { BookOpen } from 'phosphor-react';
import { useContactBook } from './ContactProvider';

interface ContactBookFABProps {
  className?: string;
}

export function ContactBookFAB({ className = '' }: ContactBookFABProps) {
  const { toggleContactBook, state } = useContactBook();

  return (
    <button
      onClick={toggleContactBook}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14
        bg-gradient-to-br from-blue-500 to-blue-600
        hover:from-blue-600 hover:to-blue-700
        active:from-blue-700 active:to-blue-800
        text-white
        rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        flex items-center justify-center
        group
        ring-4 ring-blue-500/20 ring-offset-2
        animate-pulse hover:animate-none
        ${state.isOpen ? 'rotate-12' : 'rotate-0'}
        ${className}
      `}
      title="Open Contact Book (Cmd+K)"
      aria-label="Toggle contact book"
    >
      <BookOpen 
        size={24} 
        weight="fill" 
        className={`
          transition-transform duration-200
          ${state.isOpen ? 'scale-110' : 'scale-100'}
          group-hover:scale-110
        `}
      />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150" />
      
      {/* Notification dot (for future use) */}
      {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" /> */}
    </button>
  );
}

export default ContactBookFAB;
