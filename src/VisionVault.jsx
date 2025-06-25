import React, { useState, useEffect, useRef } from "react";
import ConfirmModal from "./components/ConfirmModal";

const categories = [
  "Academic", "Career", "Body", "Snooker", "Hobbies",
  "Life", "Relationships", "Achievements", "Confidence"
];

const VisionVault = () => {
  const [visions, setVisions] = useState(() => {
    const saved = localStorage.getItem("visionVault");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState(""); // 💖 fixed
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [selectedVision, setSelectedVision] = useState(null);

  const popupRef = useRef();

  const saveToStorage = (data) => {
    localStorage.setItem("visionVault", JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!image || !selectedCategory) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newItem = {
        id: Date.now(),
        category: selectedCategory,
        description,
        image: reader.result,
      };
      const updated = [newItem, ...visions];
      setVisions(updated);
      saveToStorage(updated);
      setImage(null);
      setDescription("");
      setSelectedCategory(""); // reset dropdown
    };
    reader.readAsDataURL(image);
  };

  const handleDelete = (index) => {
    const updated = [...visions];
    updated.splice(index, 1);
    setVisions(updated);
    saveToStorage(updated);
    setConfirmIndex(null);
    setSelectedVision(null);
  };

  // Exit modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedVision(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-pink-500 mb-8">✨ Vision Vault ✨</h1>

      {/* Upload Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-pink-100">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 w-full md:w-auto"
          >
            <option value="">Choose Category</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-sm w-full md:w-auto"
          />

          {/* Description Input */}
          <input
            type="text"
            placeholder="Describe your vision ✨"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 w-full md:w-auto"
          >
            Add
          </button>
        </div>
      </div>

      {/* Vision Collage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1px]">
        {visions.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer border border-pink-100"
            onClick={() => setSelectedVision(item)}
          >
            <img
              src={item.image}
              alt="Vision"
              className="w-full h-40 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal for clicked image */}
      {selectedVision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div
            ref={popupRef}
            className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative"
          >
            <img
              src={selectedVision.image}
              alt="Full View"
              className="w-full h-60 object-cover rounded mb-4"
            />
            <h3 className="text-pink-600 font-semibold mb-2">
              {selectedVision.category}
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              {selectedVision.description}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setConfirmIndex(visions.findIndex((v) => v.id === selectedVision.id))
                }
                className="px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmIndex !== null && (
        <ConfirmModal
          message="Are you sure you want to delete this vision?"
          onConfirm={() => handleDelete(confirmIndex)}
          onCancel={() => setConfirmIndex(null)}
        />
      )}
    </div>
  );
};

export default VisionVault;
