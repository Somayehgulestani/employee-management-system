import { createContext, useContext, useState, useEffect } from "react";

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Ali Reza",
            department: "Engineering",
            status: "active",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  function addEmployee(emp) {
    setEmployees([...employees, { ...emp, id: Date.now() }]);
  }

  function deleteEmployee(id) {
    setEmployees(employees.filter((e) => e.id !== id));
  }

  function toggleStatus(id) {
    setEmployees(
      employees.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "active" ? "inactive" : "active" }
          : e,
      ),
    );
  }

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, deleteEmployee, toggleStatus }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}

// import { EmployeeProvider } from "./context/EmployeeContext";
// import EmployeeTable from "./components/EmployeeTable";
// import EmployeeForm from "./components/EmployeeForm";
// import SearchFilter from "./components/SearchFilter";

export default function App() {
  return (
    <EmployeeProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Employee Management System</h1>

        <EmployeeForm />

        <SearchFilter />

        <EmployeeTable />
      </div>
    </EmployeeProvider>
  );
}

// import { useState } from "react";
// import { useEmployees } from "../context/EmployeeContext";

function EmployeeForm() {
  const { addEmployee } = useEmployees();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Engineering");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    addEmployee({
      name,
      department,
      status: "active",
    });

    setName("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4 flex gap-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Employee name"
        className="border p-2 flex-1 rounded"
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border p-2 rounded"
      >
        <option>Engineering</option>
        <option>Marketing</option>
        <option>HR</option>
      </select>

      <button className="bg-blue-500 text-white px-4 rounded">Add</button>
    </form>
  );
}

function SearchFilter() {
  const [search, setSearch] = useState("");

  return (
    <div className="mb-4 flex gap-2">
      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

function EmployeeTable() {
  const { employees, deleteEmployee, toggleStatus } = useEmployees();

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t">
              <td className="p-2">{emp.name}</td>

              <td className="p-2">{emp.department}</td>

              <td className="p-2 text-center">
                <button
                  onClick={() => toggleStatus(emp.id)}
                  className={`px-2 py-1 rounded text-white ${
                    emp.status === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {emp.status}
                </button>
              </td>

              <td className="p-2 text-center">
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
