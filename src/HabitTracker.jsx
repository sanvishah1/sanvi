import React, { useState, useEffect } from "react";
import ConfirmModal from "./components/ConfirmModal";

const habitsList = [
  "Wake up before 8am",
  "Snooker practice",
  "Guitar",
  "Study for IITM",
  "Skincare",
  "Driving"
];

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habit-data");
    return saved
      ? JSON.parse(saved)
      : habitsList.map((name) => ({ name, log: {} }));
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [newHabit, setNewHabit] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ index: null, show: false });

  useEffect(() => {
    localStorage.setItem("habit-data", JSON.stringify(habits));
  }, [habits]);

  const startOfWeek = (offset = 0) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek(weekOffset));
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date) => date.toISOString().slice(0, 10);

  const toggleHabit = (habitIndex, dateStr) => {
    const updated = [...habits];
    const log = updated[habitIndex].log;
    log[dateStr] = !log[dateStr];
    setHabits(updated);
  };

  const addHabit = () => {
    const name = newHabit.trim();
    if (name === "") return;
    setHabits([...habits, { name, log: {} }]);
    setNewHabit("");
  };

  const deleteHabit = () => {
    const updated = [...habits];
    updated.splice(confirmDelete.index, 1);
    setHabits(updated);
    setConfirmDelete({ index: null, show: false });
  };

  const countDaysDone = (log) => Object.values(log).filter(Boolean).length;

  const currentWeekStreak = (log) =>
    weekDates.filter((date) => log[formatDate(date)]).length;

  const longestStreak = (log) => {
    const sortedDates = Object.keys(log).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (const dateStr of sortedDates) {
      if (!log[dateStr]) {
        currentStreak = 0;
        continue;
      }

      const currentDate = new Date(dateStr);
      if (lastDate) {
        const diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }

      if (currentStreak > maxStreak) maxStreak = currentStreak;
      lastDate = currentDate;
    }

    return maxStreak;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-500 mb-2 text-center">🌸 Habit Tracker</h1>
      <p className="text-center text-gray-600 italic mb-6">
        "Small daily habits become big lifelong changes."
      </p>

      {/* Week Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="text-purple-500 hover:underline"
        >
          ← Previous
        </button>
        <div className="text-md font-medium text-gray-700">
          Week of {weekDates[0].getDate().toString().padStart(2, "0")}/
          {(weekDates[0].getMonth() + 1).toString().padStart(2, "0")}/
          {weekDates[0].getFullYear()}
        </div>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="text-purple-500 hover:underline"
        >
          Next →
        </button>
      </div>

      {/* Habit Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-100">
            <th className="p-3 text-left">Habit</th>
            {weekDates.map((date, i) => (
              <th key={i} className="p-2 text-sm text-center">
                {date.toLocaleDateString("en-US", { weekday: "short" })} {date.getDate()}
              </th>
            ))}
            <th className="p-2 text-center">✅ Total Done</th>
            <th className="p-2 text-center">📅 This Week</th>
            <th className="p-2 text-center">🔥 Streak</th>
            <th className="p-2 text-center">🗑</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, hIdx) => (
            <tr key={hIdx} className="border-b">
              <td className="p-2 font-medium text-gray-800">{habit.name}</td>
              {weekDates.map((date, dIdx) => {
                const dateStr = formatDate(date);
                return (
                  <td key={dIdx} className="text-center">
                    <input
                      type="checkbox"
                      checked={!!habit.log[dateStr]}
                      onChange={() => toggleHabit(hIdx, dateStr)}
                      className="w-5 h-5 accent-purple-500"
                    />
                  </td>
                );
              })}
              <td className="text-center text-green-600">{countDaysDone(habit.log)}</td>
              <td className="text-center text-blue-500">{currentWeekStreak(habit.log)}</td>
              <td className="text-center text-pink-600">{longestStreak(habit.log)}</td>
              <td className="text-center">
                <button
                  onClick={() => setConfirmDelete({ index: hIdx, show: true })}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Habit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addHabit();
        }}
        className="mt-6 flex gap-3 items-center"
      >
        <input
          type="text"
          placeholder="New habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="p-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Add
        </button>
      </form>

      {/* Confirm Delete Modal */}
      {confirmDelete.show && (
        <ConfirmModal
          message="Are you sure you want to delete this habit?"
          onConfirm={deleteHabit}
          onCancel={() => setConfirmDelete({ index: null, show: false })}
        />
      )}
    </div>
  );
};

export default HabitTracker;
