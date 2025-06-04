import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'py-2 px-4 font-medium rounded-xl transition-colors duration-200';
  
  const variantStyles = {
    primary: 'bg-space-star/10 hover:bg-space-star/20 text-space-gray',
    secondary: 'bg-space-star/5 hover:bg-space-star/10 text-space-gray',
    outline: 'border border-space-star/10 text-space-gray hover:bg-space-star/5',
    icon: 'p-2 rounded-full hover:bg-space-star/10 text-space-gray',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;