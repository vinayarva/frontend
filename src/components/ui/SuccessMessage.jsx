import React from 'react';

function SuccessMessage({ message }) {
    if (!message) return null;
    return (
        <p className="mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-md">
            {message}
        </p>
    );
}
export default SuccessMessage;
