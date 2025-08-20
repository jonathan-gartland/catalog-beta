'use client';

import { useState } from 'react';

interface DataSourceToggleProps {
  onSourceChange: (useGoogleSheets: boolean) => void;
  currentSource: 'local' | 'sheets';
  loading?: boolean;
}

export default function DataSourceToggle({ 
  onSourceChange, 
  currentSource, 
  loading = false 
}: DataSourceToggleProps) {
  const [isEnabled, setIsEnabled] = useState(currentSource === 'sheets');

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onSourceChange(newState);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Data Source
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isEnabled 
              ? 'Connected to Google Sheets (live data)' 
              : 'Using local data file'
            }
          </p>
          {loading && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Loading data...
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              disabled={loading}
              className="sr-only"
            />
            <div className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
              isEnabled 
                ? 'bg-blue-600' 
                : 'bg-gray-300 dark:bg-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isEnabled ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Google Sheets
            </span>
          </label>
        </div>
      </div>
      
      {isEnabled && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Live sync enabled:</strong> Changes to your Google Sheet will automatically update the collection. 
                Make sure your service account has access to the spreadsheet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
