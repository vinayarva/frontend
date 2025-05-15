import React from 'react';
import ViewModeButton from '../ui/ViewModeButton'; 
import { VIEW_MODES } from '../../constants';    

function JsonViewerHeader({ currentViewMode, onSetViewMode }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">
                JSON Output
            </h2>
            <div className="flex space-x-2">
                <ViewModeButton
                    currentViewMode={currentViewMode}
                    mode={VIEW_MODES.JSON} 
                    setViewMode={onSetViewMode}
                >
                    JSON {/* Changed button text */}
                </ViewModeButton>
                <ViewModeButton
                    currentViewMode={currentViewMode}
                    mode={VIEW_MODES.TABLE}
                    setViewMode={onSetViewMode}
                >
                    Table View
                </ViewModeButton>
            </div>
        </div>
    );
}

export default JsonViewerHeader;