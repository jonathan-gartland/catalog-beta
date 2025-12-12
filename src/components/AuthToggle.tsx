'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';

export default function AuthToggle() {
  const { isAuthorized, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (login(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    logout();
    setPassword('');
    setError('');
  };

  if (isAuthorized) {
    return (
      <div className="flex items-center space-x-4" role="status" aria-live="polite">
        <div className="flex items-center space-x-2">
          <div
            className="w-2 h-2 bg-green-500 rounded-full"
            aria-label="Authorized"
            role="status"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Financial details visible
          </span>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout} aria-label="Logout">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter password"
          className="w-40"
          error={error}
          aria-label="Password"
        />
        <Button variant="primary" size="sm" onClick={handleLogin} aria-label="Login">
          Login
        </Button>
      </div>
    </div>
  );
}