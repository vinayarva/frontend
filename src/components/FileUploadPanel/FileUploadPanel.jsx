import React from 'react';
import FileUploadPanelHeader from './FileUploadPanelHeader';
import FileInput from '../ui/FileInput';
import LoadingIndicator from '../ui/LoadingIndicator'; // Global loading indicator
import ErrorMessage from '../ui/ErrorMessage';     // Global error message for upload process
// import SuccessMessage from '../ui/SuccessMessage'; // Global success message
import FileListDisplay from './FileListDisplay';     // New component for listing files

function FileUploadPanel({
  onFileSelect,
  processedFiles,
  selectedFileId,
  onSelectFileFromList,
  isUploading, // Global loading state for the whole upload process
  uploadError,  // Global error for the upload process
}) {
  return (
    <div className="w-full md:w-[40%] lg:w-[35%] md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300 p-6 md:p-8 bg-white flex-shrink-0">
      <div className="w-full max-w-md text-center">
        <FileUploadPanelHeader />
        <FileInput onChange={onFileSelect} disabled={isUploading} multiple={true} />
        {isUploading && <LoadingIndicator text="Processing files..." />}
        <ErrorMessage message={uploadError} />
        {/* <SuccessMessage message={uploadSuccessMessage} /> */}

        <FileListDisplay
          files={processedFiles}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFileFromList}
        />
      </div>
    </div>
  );
}
export default FileUploadPanel;