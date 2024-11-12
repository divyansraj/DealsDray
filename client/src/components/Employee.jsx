import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "./Form";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token")
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  // New states for sorting
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");

  // Form state variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("HR");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [isOpen, setIsOpen] = useState(false); 

    const fields = [
      { label: "Name", field: "name" },
      { label: "Email", field: "email" },
      { label: "Mobile No", field: "mobile" },
      { label: "Designation", field: "designation" },
      { label: "Gender", field: "gender" },
      { label: "Course", field: "courses" },
      { label: "Create Date", field: "createDate" },
    ];




  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/employee/getAllEmployee",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/employee/deleteEmployee/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(employees.filter((employee) => employee.id !== id));
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) setCourses([...courses, value]);
    else setCourses(courses.filter((course) => course !== value));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("courses", courses);
    if (selectedImage) formData.append("image", selectedImage);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/employee/createEmployee",
        formData
      );
      if (response.data.success) {
        fetchEmployees();
        resetForm();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating employee");
    }
    setShowCreateModal(false);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setDesignation("HR");
    setGender("");
    setCourses([]);
    setSelectedImage(null);
  };

  const handleEdit = (id) => {
    setEmployeeId(id);
    setShowEditModal(true);
  };

  // Sorting function
  const sortEmployees = (employeesList) => {
    return employeesList.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Apply search and sort filters
  const filteredEmployees = sortEmployees(
    employees.filter((employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setIsOpen(false); // Close the dropdown when an option is selected
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };

  return (
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Employee List</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Employee
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-full sm:w-1/3 px-4 py-2 rounded-lg bg-gray-100  focus:ring-2 focus:ring-purple-600"
          />
          <div className="mt-4 sm:mt-0">
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="px-4 py-2 mx-2 bg-gray-100 rounded-lg hover:bg-gray-300"
                id="options-menu"
                aria-expanded={isOpen ? "true" : "false"}
                aria-haspopup="true"
                onClick={toggleDropdown} // Toggle dropdown when clicked
              >
                {sortBy
                  ? `Sort by ${
                      fields.find((field) => field.field === sortBy).label
                    }`
                  : "Sort By"}
                {sortBy && (sortOrder === "asc" ? " ▲" : " ▼")}
              </button>

              {isOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className="py-1" role="none">
                    {fields.map((field) => (
                      <button
                        key={field.field}
                        onClick={() => handleSort(field.field)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        role="menuitem"
                      >
                        {`Sort by ${field.label}`}
                        {sortBy === field.field &&
                          (sortOrder === "asc" ? " ▲" : " ▼")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {[
                  { label: "Unique Id", field: "id" },
                  { label: "Image", field: "" },
                  { label: "Name", field: "name" },
                  { label: "Email", field: "email" },
                  { label: "Mobile No", field: "mobile" },
                  { label: "Designation", field: "designation" },
                  { label: "Gender", field: "gender" },
                  { label: "Course", field: "courses" },
                  { label: "Create Date", field: "createDate" },
                  { label: "Action", field: "" },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    onClick={() => field}
                    className="text-left px-6 py-3 font-medium cursor-pointer"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="px-6 py-4">{employee.id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={employee.image.secure_url}
                      alt="employee"
                      className="w-8 rounded-sm"
                    />
                  </td>
                  <td className="px-6 py-4">{employee.name}</td>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4">{employee.mobile}</td>
                  <td className="px-6 py-4">{employee.designation}</td>
                  <td className="px-6 py-4">{employee.gender}</td>
                  <td className="px-6 py-4">{employee.courses}</td>
                  <td className="px-6 py-4">
                    {employee.createDate.split("T")[0]}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className=" hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-slate-800 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowCreateModal(!showCreateModal)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Mobile No</label>
                <input
                  type="text"
                  placeholder="Enter Mobile No"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Designation</label>
                <select
                  onChange={(e) => setDesignation(e.target.value)}
                  defaultValue="HR"
                  value={designation}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Gender</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={(e) => setGender("Male")}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={(e) => setGender("Female")}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Courses</label>
                <div className="space-y-2">
                  {["MCA", "BCA", "BSc"].map((course) => (
                    <label key={course} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={course}
                        checked={courses.includes(course)} // Check if the course is in 'courses' state
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      {course}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Create Employee
              </button>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <Form
          employeeId={employeeId} // Pass the selected employee ID
          setShowEditModal={setShowEditModal} // Pass the setShowEditModal function to control modal visibility
          setEmployees={setEmployees}
        />
      )}
    </div>
  );
};

export default Employee;
