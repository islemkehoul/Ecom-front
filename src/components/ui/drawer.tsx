import { useState } from 'react';
import type { ReactNode } from 'react';
import { X, Menu } from 'lucide-react';

// Types
type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  children: ReactNode;
  title?: string;
}

// Drawer Component
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'left',
  children,
  title = 'Menu'
}) => {
  const positionClasses: Record<DrawerPosition, string> = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const translateClasses: Record<DrawerPosition, string> = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
  };

  const sizeClasses: Record<DrawerPosition, string> = {
    left: 'w-80',
    right: 'w-80',
    top: 'h-64',
    bottom: 'h-64'
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed ${positionClasses[position]} ${sizeClasses[position]} bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${translateClasses[position]}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile Menu Button Component
interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-accent transition-colors ${className}`}
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6 text-foreground" />
    </button>
  );
};
