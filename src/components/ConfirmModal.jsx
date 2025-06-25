import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🛑 Confirm</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
