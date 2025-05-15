import React, { useState, useCallback, useEffect } from 'react';
import FileUploadPanel from './components/FileUploadPanel/FileUploadPanel';
import JsonViewerPanel from './components/JsonViewerPanel/JsonViewerPanel';
import { VIEW_MODES } from './constants';
import SuccessMessage from './components/ui/SuccessMessage';

const generateUniqueId = () => `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const MAX_FILES = 10;

function App() {
  const [processedFilesData, setProcessedFilesData] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.JSON);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const [uploadErrorGlobal, setUploadErrorGlobal] = useState(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");

  const handleFileUpload = useCallback(async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (e.target) e.target.value = null; // Reset file input

    if (selectedFiles.length === 0) return;

    if (selectedFiles.length > MAX_FILES) {
      setUploadErrorGlobal(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      setUploadSuccessMessage("");
      return;
    }

    setIsUploadingGlobal(true);
    setUploadErrorGlobal(null);
    setUploadSuccessMessage("");

    // Prepare initial entries for UI update for the current batch
    const currentBatchFileEntries = selectedFiles.map(file => ({
      id: generateUniqueId(),
      fileName: file.name,
      jsonData: null,
      error: null,
      isLoading: true,
     
    }));

    
    setProcessedFilesData(prevFiles => [...prevFiles, ...currentBatchFileEntries].slice(-MAX_FILES * 2)); 

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("files", file); 
    });

   

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
     
      });

      if (!response.ok) {
       
        let errorMessage = `Initial request failed: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json(); 
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) { console.log(e) }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Response body is null, cannot read SSE stream.");
      }

      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      
      const processLine = (line) => {
        if (line.startsWith("data:")) {
          const jsonDataString = line.substring(5).trim(); 
          if (jsonDataString) {
            try {
              const eventData = JSON.parse(jsonDataString);

              if (eventData.message === "Processing complete") {
                setUploadSuccessMessage("All files processed successfully.");
                setIsUploadingGlobal(false); 
                 
                setProcessedFilesData(prev => prev.map(pf => 
                    currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName && pf.isLoading) ? {...pf, isLoading: false} : pf
                ));
                return; 
              }

           
              setProcessedFilesData(prev =>
                prev.map(pf => {
                  if (pf.fileName === eventData.fileName && currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName)) {
                   
                    if (!selectedFileId && eventData.processedData && !eventData.error) {
                      setSelectedFileId(pf.id);
                    }
                    return {
                      ...pf,
                      jsonData: eventData.processedData || null,
                      error: eventData.error || null,
                      isLoading: false,
                    };
                  }
                  return pf;
                })
              );
            } catch (parseError) {
              console.error("Failed to parse SSE data JSON:", parseError, "Data:", jsonDataString);
             
            }
          }
        }
      };

     
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
        
          setIsUploadingGlobal(false); 
          if (!uploadSuccessMessage) { 
             setUploadSuccessMessage("File stream ended.");
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        let EOL_index;
        
        while ((EOL_index = buffer.indexOf("\n\n")) >= 0) {
            const lines = buffer.substring(0, EOL_index).split("\n");
            lines.forEach(line => processLine(line.trim()));
            buffer = buffer.substring(EOL_index + 2);
        }
      }

    } catch (err) {
      console.error("File upload/SSE processing error:", err);
      setUploadErrorGlobal(err.message || "An error occurred during file processing.");
      setIsUploadingGlobal(false);
     
      setProcessedFilesData(prev =>
        prev.map(pf =>
          currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName)
            ? { ...pf, error: err.message || "Processing failed.", isLoading: false }
            : pf
        )
      );
    }
  }, [selectedFileId]); 

  const handleSelectFileFromList = useCallback((fileId) => {
    setSelectedFileId(fileId);
    setUploadErrorGlobal(null);
    setUploadSuccessMessage("");
  }, []);

  const currentSelectedFile = processedFilesData.find(f => f.id === selectedFileId);
  const selectedFileData = currentSelectedFile?.jsonData || null;
  const selectedFileName = currentSelectedFile?.fileName || "";

   useEffect(() => {
    if (uploadSuccessMessage) {
      const timer = setTimeout(() => setUploadSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessMessage]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans antialiased">
      <FileUploadPanel
        onFileSelect={handleFileUpload}
        processedFiles={processedFilesData}
        selectedFileId={selectedFileId}
        onSelectFileFromList={handleSelectFileFromList}
        isUploading={isUploadingGlobal}
        uploadError={uploadErrorGlobal}
      />
      {uploadSuccessMessage && (
         <div className="absolute top-4 right-4 z-50"> {/* Position success message */}
            <SuccessMessage message={uploadSuccessMessage} />
         </div>
      )}
      <JsonViewerPanel
        jsonData={selectedFileData}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        selectedFileName={selectedFileName}
      />
    </div>
  );
}
export default App;