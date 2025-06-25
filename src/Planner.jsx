import React, { useContext, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Planner() {
  const {
    tasks = [],
    subjects = [],
  } = useContext(GlobalContext) || {};

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    if (view === "week") newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    if (view === "day") newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const events = useMemo(() => {
    const taskEvents = tasks
      .filter((task) => task.date)
      .map((task) => ({
        title: task.text || task.title || "Untitled Task",
        start: new Date(task.date),
        end: new Date(task.date),
        allDay: true,
        resource: "task",
      }));

    const assignmentEvents = subjects.flatMap((subject) =>
      subject.assignments?.map((a) => ({
        title: a.name,
        start: new Date(a.date),
        end: new Date(a.date),
        allDay: true,
        resource: subject.university === "NMIMS" ? "assignment_nmims" : "assignment_iitm",
      })) || []
    );

    const examEvents = subjects.flatMap((subject) =>
      subject.exams?.map((e) => ({
        title: e.name,
        start: new Date(e.date),
        end: new Date(e.date),
        allDay: true,
        resource: subject.university === "NMIMS" ? "exam_nmims" : "exam_iitm",
      })) || []
    );

    return [...taskEvents, ...assignmentEvents, ...examEvents];
  }, [tasks, subjects]);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#f9a8d4"; // tasks
    if (event.resource === "assignment_nmims" || event.resource === "exam_nmims") backgroundColor = "#ddd6fe"; // NMIMS - lavender
    if (event.resource === "assignment_iitm" || event.resource === "exam_iitm") backgroundColor = "#fef08a"; // IITM - yellow

    return {
      style: {
        backgroundColor,
        color: "#1f2937",
        borderRadius: "10px",
        padding: "4px 8px",
        fontSize: "0.85rem",
        fontFamily: "Comfortaa, cursive",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "inline-block",
        maxWidth: "100%",
        border: "none",
      },
    };
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday
      ? {
          style: {
            backgroundColor: "#fce7f3",
            borderRadius: "10px",
            border: "2px solid #ec4899",
          },
        }
      : {};
  };

  const handleEventClick = (event) => {
    if (event.resource === "task") navigate("/");
    else navigate("/dashboard");
  };

  const getHeaderText = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") {
      const start = format(startOfWeek(currentDate), "MMM d");
      const end = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6), "MMM d, yyyy");
      return `${start} – ${end}`;
    }
    if (view === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    return "";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">📅 Planner</h1>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{getHeaderText()}</h2>
        <div className="flex gap-3">
          {["month", "week", "day"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                view === v ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-600"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={view}
        onView={setView}
        onNavigate={setCurrentDate}
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        onSelectEvent={handleEventClick}
        style={{ height: "70vh", backgroundColor: "white", borderRadius: "12px" }}
        toolbar={false}
      />

      {/* Navigation */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => handleNavigate("prev")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ⬅️ Back
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          🔄 Today
        </button>
        <button
          onClick={() => handleNavigate("next")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ➡️ Next
        </button>
      </div>
    </div>
  );
}

export default Planner;
