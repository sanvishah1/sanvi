import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("dashboard-subjects");
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("dashboard-assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("dashboard-exams");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("dashboard-subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("dashboard-assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("dashboard-exams", JSON.stringify(exams));
  }, [exams]);

  return (
    <GlobalContext.Provider
      value={{
        tasks,
        setTasks,
        subjects,
        setSubjects,
        assignments,
        setAssignments,
        exams,
        setExams,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
