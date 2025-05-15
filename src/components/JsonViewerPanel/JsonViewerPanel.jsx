import React from 'react';
import JsonViewerHeader from './JsonViewerHeader'; 
import JsonDisplay from './JsonDisplay';          

function JsonViewerPanel({ jsonData, viewMode, onSetViewMode }) {
  return (
    <div className="w-full md:w-[60%] lg:w-[65%] md:h-screen flex flex-col p-6 md:p-8 overflow-hidden">
      <JsonViewerHeader currentViewMode={viewMode} onSetViewMode={onSetViewMode} />
      <div className="flex-1 overflow-y-auto bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
        <JsonDisplay jsonData={jsonData} viewMode={viewMode} />
      </div>
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI PDF Extractor . For demonstration purposes.</p>
      </footer>
    </div>
  );
}

export default JsonViewerPanel;