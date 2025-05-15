import React from 'react';

function FileListDisplay({ files, selectedFileId, onSelectFile }) {
  if (!files || files.length === 0) {
    return <p className="mt-4 text-sm text-gray-500">No files processed yet.</p>;
  }

  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Processed Files:</h3>
      <ul className="max-h-60 overflow-y-auto border border-gray-300 rounded-md divide-y divide-gray-300">
        {files.map((file) => (
          <li key={file.id}>
            <button
              onClick={() => onSelectFile(file.id)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150
                          ${selectedFileId === file.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span className="font-medium">{file.fileName}</span>
              {file.error && <span className="block text-xs text-red-500 truncate">Error: {file.error}</span>}
              {!file.error && file.jsonData && <span className="block text-xs text-green-500">Processed successfully</span>}
               {!file.error && !file.jsonData && file.isLoading && <span className="block text-xs text-yellow-500">Processing...</span>}
               {!file.error && !file.jsonData && !file.isLoading && !file.error && <span className="block text-xs text-gray-400">Pending upload or issue</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default FileListDisplay;