// 👇 all your imports are untouched
import React, { useState, useContext } from "react";
import ConfirmModal from "./components/ConfirmModal";
import { GlobalContext } from "./context/GlobalContext";

// 👇 entire component preserved as-is
const Dashboard = () => {
  const { subjects, setSubjects } = useContext(GlobalContext);

  const [editSubjectIdx, setEditSubjectIdx] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({ name: "", university: "" });

  const [editItem, setEditItem] = useState({ type: null, subject: null, index: null });
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");

  const [modal, setModal] = useState({ show: false, action: null });

  const showConfirm = (action) => setModal({ show: true, action });
  const handleConfirm = () => {
    modal.action();
    setModal({ show: false, action: null });
  };
  const handleCancel = () => setModal({ show: false, action: null });

  const startEditSubject = (idx) => {
    setEditSubjectIdx(idx);
    setEditSubjectData({ ...subjects[idx] });
  };

  const saveSubjectEdit = () => {
    const updated = [...subjects];
    updated[editSubjectIdx] = editSubjectData;
    setSubjects(updated);
    setEditSubjectIdx(null);
  };

  const cancelSubjectEdit = () => {
    setEditSubjectIdx(null);
  };

  const deleteSubject = (idx) => {
    showConfirm(() => {
      const updated = [...subjects];
      updated.splice(idx, 1);
      setSubjects(updated);
    });
  };

  const startEditItem = (type, subjectIdx, index) => {
    const item = subjects[subjectIdx][type][index];
    setEditItem({ type, subject: subjectIdx, index });
    setEditText(item.name);
    setEditDate(item.date || "");
  };

  const saveItemEdit = () => {
    const updated = [...subjects];
    updated[editItem.subject][editItem.type][editItem.index] = {
      name: editText,
      date: editDate,
    };
    setSubjects(updated);
    setEditItem({ type: null, subject: null, index: null });
    setEditText("");
    setEditDate("");
  };

  const cancelItemEdit = () => {
    setEditItem({ type: null, subject: null, index: null });
    setEditText("");
    setEditDate("");
  };

  const deleteItem = (type, subjectIdx, index) => {
    showConfirm(() => {
      const updated = [...subjects];
      updated[subjectIdx][type].splice(index, 1);
      setSubjects(updated);
    });
  };

  const renderSubjectBox = (subject, actualIdx) => (
    <div key={actualIdx} className="bg-white shadow-md rounded-xl p-5 mb-6 border-l-4 border-pink-400">
      {editSubjectIdx === actualIdx ? (
        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <input
            className="border px-3 py-2 rounded w-full md:w-1/2"
            value={editSubjectData.name}
            onChange={(e) =>
              setEditSubjectData({ ...editSubjectData, name: e.target.value })
            }
          />
          <input
            className="border px-3 py-2 rounded w-full md:w-1/2"
            value={editSubjectData.university}
            onChange={(e) =>
              setEditSubjectData({ ...editSubjectData, university: e.target.value })
            }
          />
          <div className="flex gap-2">
            <button onClick={saveSubjectEdit} className="text-green-600 hover:underline">Save</button>
            <button onClick={cancelSubjectEdit} className="text-gray-500 hover:underline">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800">
            {subject.name} <span className="text-sm text-gray-500">({subject.university})</span>
          </h2>
          <div className="flex gap-3 text-sm mt-1">
            <button onClick={() => startEditSubject(actualIdx)} className="text-blue-500 hover:underline">Edit</button>
            <button onClick={() => deleteSubject(actualIdx)} className="text-red-500 hover:underline">Delete</button>
          </div>
        </div>
      )}

      {/* Assignments */}
      <div className="mt-4">
        <p className="text-purple-600 font-medium mb-1">Assignments:</p>
        <ul className="text-gray-700 space-y-2">
          {subject.assignments.map((item, i) => (
            <li key={i} className="flex flex-col md:flex-row md:items-center md:gap-3">
              {editItem.type === "assignments" && editItem.subject === actualIdx && editItem.index === i ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Assignment name"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button onClick={saveItemEdit} className="text-green-600 hover:underline text-sm">Save</button>
                  <button onClick={cancelItemEdit} className="text-gray-500 hover:underline text-sm">Cancel</button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>
                    📘 {item.name} {item.date && <span className="text-sm text-gray-500 ml-1">({item.date})</span>}
                  </span>
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => startEditItem("assignments", actualIdx, i)} className="text-blue-500 hover:underline">Edit</button>
                    <button onClick={() => deleteItem("assignments", actualIdx, i)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.assignmentName.value.trim();
            const date = e.target.assignmentDate.value;
            if (!name) return;
            const updated = [...subjects];
            // ✅ ADDED SOURCE FIELD
            updated[actualIdx].assignments.push({ name, date, source: subject.university.toLowerCase() });
            setSubjects(updated);
            e.target.reset();
          }}
          className="flex gap-2 mt-2 flex-wrap"
        >
          <input type="text" name="assignmentName" placeholder="New assignment" className="border rounded px-2 py-1 text-sm w-48" />
          <input type="date" name="assignmentDate" className="border rounded px-2 py-1 text-sm" />
          <button type="submit" className="text-pink-500 hover:underline text-sm">+ Add</button>
        </form>
      </div>

      {/* Exams */}
      <div className="mt-4">
        <p className="text-red-500 font-medium mb-1">Exams:</p>
        <ul className="text-gray-700 space-y-2">
          {subject.exams.map((item, i) => (
            <li key={i} className="flex flex-col md:flex-row md:items-center md:gap-3">
              {editItem.type === "exams" && editItem.subject === actualIdx && editItem.index === i ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Exam name"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button onClick={saveItemEdit} className="text-green-600 hover:underline text-sm">Save</button>
                  <button onClick={cancelItemEdit} className="text-gray-500 hover:underline text-sm">Cancel</button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>
                    📝 {item.name} {item.date && <span className="text-sm text-gray-500 ml-1">({item.date})</span>}
                  </span>
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => startEditItem("exams", actualIdx, i)} className="text-blue-500 hover:underline">Edit</button>
                    <button onClick={() => deleteItem("exams", actualIdx, i)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.examName.value.trim();
            const date = e.target.examDate.value;
            if (!name) return;
            const updated = [...subjects];
            // ✅ ADDED SOURCE FIELD
            updated[actualIdx].exams.push({ name, date, source: subject.university.toLowerCase() });
            setSubjects(updated);
            e.target.reset();
          }}
          className="flex gap-2 mt-2 flex-wrap"
        >
          <input type="text" name="examName" placeholder="New exam" className="border rounded px-2 py-1 text-sm w-48" />
          <input type="date" name="examDate" className="border rounded px-2 py-1 text-sm" />
          <button type="submit" className="text-pink-500 hover:underline text-sm">+ Add</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">📚 Academics</h1>

      {["NMIMS", "IITM"].map((uni) => (
        <div key={uni} className="mb-10">
          <h2 className="text-2xl font-bold text-pink-700 mb-4 border-b-2 border-pink-300 pb-1">{uni} Subjects</h2>
          {subjects
            .filter((s) => s.university === uni)
            .map((subject) => {
              const actualIdx = subjects.findIndex((s) => s === subject);
              return renderSubjectBox(subject, actualIdx);
            })}
        </div>
      ))}

      {/* Add Subject */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">➕ Add New Subject</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.subjectName.value.trim();
            const university = e.target.university.value.trim();
            if (!name || !university) return;

            const newSubject = {
              name,
              university,
              assignments: [],
              exams: [],
            };
            setSubjects([...subjects, newSubject]);
            e.target.reset();
          }}
          className="flex gap-4 flex-wrap items-center"
        >
          <input type="text" name="subjectName" placeholder="Subject name" className="border rounded px-3 py-2 w-52" />
          <select
            name="university"
            className="border rounded px-3 py-2 w-52 bg-pink-50 text-pink-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300"
            defaultValue=""
          >
            <option value="" disabled>Select University</option>
            <option value="NMIMS">NMIMS</option>
            <option value="IITM">IITM</option>
          </select>
          <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Add Subject</button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {modal.show && (
        <ConfirmModal
          message="Are you sure you want to delete this?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Dashboard;
