import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    position: '',
    id: ''
  });
  const [searchId, setSearchId] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('http://localhost:5000/employees');
    setEmployees(res.data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async () => {
    if (editId) {
      // Update existing employee
      await axios.put(`http://localhost:5000/employees/${editId}`, formData);
      setEditId(null);
    } else {
      // Add new employee
      await axios.post('http://localhost:5000/employees', formData);
    }
    setFormData({ name: '', email: '', phone: '', image: '', position: '', id: '' });
    fetchEmployees();
  };

  const handleEditEmployee = (employee) => {
    // Set the form data with the employee’s current details for editing
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      image: employee.image,
      position: employee.position,
      id: employee.id
    });
    setEditId(employee.id);
  };

  const handleDeleteEmployee = async (id) => {
    await axios.delete(`http://localhost:5000/employees/${id}`);
    fetchEmployees();
  };

  const handleSearch = () => {
    const foundEmployee = employees.find(emp => emp.id === searchId);
    if (foundEmployee) {
      alert(`Employee Found: ${foundEmployee.name}`);
    } else {
      alert("Employee not found");
    }
  };

  return (
    <div>
      <div className='text-black flex items-center w-full bg-white'>
        <div className="flex m-5"><h1 className='text-2xl'>Employee</h1></div>
        <div className="flex w-full justify-center" >
          <ul className='flex w-36 items-center gap-5 mt-5'>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      <div className='flex justify-evenly'>
        {/* Employee Form */}
        <div className='bg-white w-11/12 max-w-md flex-col p-7 outline-none mt-24 ml-10'>
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' name='name' placeholder='  Name' value={formData.name} onChange={handleInputChange} />
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' name='email' placeholder='  Email Address' value={formData.email} onChange={handleInputChange} />
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' name='phone' placeholder='  Phone Number' value={formData.phone} onChange={handleInputChange} />
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' name='image' placeholder='  Image URL' value={formData.image} onChange={handleInputChange} />
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type="text" name='position' placeholder='  Position' value={formData.position} onChange={handleInputChange} />
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' name='id' placeholder='  ID' value={formData.id} onChange={handleInputChange} />

          <button onClick={handleAddEmployee} className='border-none rounded-full bg-[#669bbc] w-40 h-14'>
            {editId ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>

        {/* Employee List */}
        <div className='bg-white w-11/12 max-w-md flex-col p-7 outline-none mt-24'>
          <input className='flex items-center my-7 bg-gray-300 h-16 w-full rounded-full'
            type='text' placeholder='Search by ID' value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <button onClick={handleSearch} className='border-none rounded-full bg-[#669bbc] w-40 h-14 mb-5'>Search</button>

          {employees.map(employee => (
            <Card key={employee.id} className="py-4 bg-gray-300 rounded-lg justify-center my-5">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <p className="text-tiny uppercase font-bold">{employee.position}</p>
                <h4 className="font-bold text-large">{employee.name}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2 items-center">
                <Image alt="Employee Image" className="object-cover rounded-xl" src={employee.image} width={270} />
                <p>Email: {employee.email}</p>
                <p>Phone: {employee.phone}</p>
                <button onClick={() => handleEditEmployee(employee)} className='border-none rounded-full bg-green-500 w-24 h-10 mt-3'>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee.id)} className='border-none rounded-full bg-red-500 w-24 h-10 mt-3'>Delete</button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
