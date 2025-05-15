import React from 'react';
import { VIEW_MODES } from '../../constants';

function JsonDisplay({ jsonData, viewMode }) {
  if (jsonData === null || jsonData === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center p-4">
          Select a file to view its data, or upload new files.
        </p>
      </div>
    );
  }

  // JSON View (handles both objects and arrays)
  if (viewMode === VIEW_MODES.JSON) {
    return (
      <pre className="whitespace-pre-wrap text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    );
  }

  // Table View
  if (viewMode === VIEW_MODES.TABLE) {
    if (Array.isArray(jsonData)) {
      // Handle array of objects (e.g., line_items)
      if (jsonData.length === 0) {
        return <p className="text-gray-500 text-center p-4">The data array is empty.</p>;
      }
      const headers = Object.keys(jsonData[0] || {});
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="p-3 text-left font-semibold text-gray-600 border-b border-r border-gray-300 capitalize">
                    {header.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData.map((rowItem, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                  {headers.map((header) => (
                    <td key={`${rowIndex}-${header}`} className="p-3 text-gray-700 border-r border-gray-300 last:border-r-0 break-words">
                      {typeof rowItem[header] === 'object' && rowItem[header] !== null
                        ? JSON.stringify(rowItem[header])
                        : String(rowItem[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // Handle a single object (e.g., processedData with various fields)
      const entries = Object.entries(jsonData);
      if (entries.length === 0) {
        return <p className="text-gray-500 text-center p-4">The data object is empty.</p>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600 border-b border-r border-gray-300 w-1/3">Key</th>
                <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-3 font-medium text-gray-700 bg-gray-50 border-r border-gray-300 break-words">
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="p-3 text-gray-700 break-words">
                    {typeof value === 'object' && value !== null
                      ? JSON.stringify(value, null, 2) // Display nested objects/arrays as JSON string
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Fallback for other data types if necessary
      return <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center">Data is not in a recognized format for table view.</p>;
    }
  }

  // Fallback for unknown view mode or data type
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center mb-4">
        Cannot display data in the current view.
      </p>
      <pre className="w-full whitespace-pre-wrap text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </div>
  );
}
export default JsonDisplay;