import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function EmployeeManagement() {

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        name : '',
        employeeId : '',
        email : '',
        phone : '',
        dateOfJoin : '',
        department : '',
        role: ''
    })

    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees');
            setEmployees(response.data);
            console.log(employees)
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    function validateEmployeeData(employee) {
        // Check for required fields
        // const requiredFields = ['name', 'employeeId', 'email', 'phoneNumber', 'department', 'dateOfJoining', 'role'];
        // requiredFields.forEach(field => {
        //   if (!employee[field] || employee[field].trim() === '') {
        //     errors[field] = `${field} is required`;
        //   }
        // });
      
        // Name validation
        if (employee.name && !/^[a-zA-Z\s]+$/.test(employee.name)) {
          alert('Name must only contain letters and spaces');
          return false;
        }
      
        // Employee ID validation
        if (employee.employeeId && !/^[0-9]{1,10}$/.test(employee.employeeId)) {
          alert('Employee ID must be alphanumeric and up to 10 characters');
          return false;
        }
      
        // Email validation
        if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        alert('Invalid email format');
        return false;
        }
      
        // Phone number validation
        console.log(employee.phone);
        if (employee.phone && !/^\d{10}$/.test(employee.phone)) {
          alert('Phone number must be exactly 10 digits');
          return false;
        }
      
        // Role validation
        if (employee.role && !/^[a-zA-Z\s]+$/.test(employee.role)) {
          alert('Role must only contain letters and spaces');
          return false;
        }
      
        return true;
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateEmployeeData(formData)){
            try {
                if (editingEmployee) {
                    const response = await axios.put(`http://localhost:5000/employees/${editingEmployee.id}`, formData);
                    console.log(response.data);
                    alert('Employee updated successfully!');
                } else {
                    const response = await axios.post('http://localhost:5000/employees', formData);
                    console.log(response.data)
                    if(! response.data.employeeAdded) alert('Employee Already Exists!');
                    else alert("Addedd Successfully")
                }
                setFormData({
                    name: '',
                    employeeId: '',
                    email: '',
                    phone: '',
                    department: '',
                    dateOfJoining: '',
                    role: '',
                });
                // setEditingEmployee(null);
                fetchEmployees();
            } catch (error) {
                console.error('Error saving employee:', error);
            }
        }
    };


    const setChangedData = (e) => {
        console.log("Form Data Changed");
        console.log(e.target);
        setFormData({...formData, [e.target.name] : e.target.value});
        console.log(formData);
    }

    const resetForm = (e)=> {
        e.preventDefault();
        console.log("Reset Clicked");
        setFormData({
            name : '',
            employeeId : '',
            email : '',
            phone : '',
            dateOfJoin : '',
            department : '',
            role: ''
        })
    }

    const handleEdit = (employee) => {
        if(validateEmployeeData){
            console.log("new", employee)
        setEditingEmployee(employee);
        setFormData({ ...employee });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/employees/${id}`);
            alert('Employee deleted successfully!');
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return(<>
    <div className='container'>
        <h1>Employee Management System </h1>
        <form >
            <div>
            <label name='name'>Employee Name</label>
            <input name = 'name' type='text'  value={formData.name} required onChange={setChangedData}></input>
            </div>

            <div>
                <label>Employee ID</label>
                <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={setChangedData}
                    required
                    maxLength={10}
                />
             </div>

            <div>
            <label name='email'> Employee Email </label> 
            <input name = 'email' type='email' onChange={setChangedData} value={formData.email} required></input>
            </div>

            <div>
            <label name='phone'>Phone</label>
            <input name='phone' type='text' onChange={setChangedData} value={formData.phone} required></input>
            </div>

            <div>
            <label name='dateOfJoining'>Joining Date</label>
            <input name='dateOfJoining' type='date' onChange={setChangedData} value={formData.dateOfJoining}                         max={new Date().toISOString().split('T')[0]}
 required></input>
            </div>

            <div>
            <label name='department'>Department</label>
            <select name='department' onChange={setChangedData} value = {formData.department} required>
                <option value=''>Select Department</option>
                <option value='HR'>HR</option>
                <option value='Marketing'>Marketing</option>
                <option value='Sales'>Sales</option>
            </select>
            </div>

            <div>
            <label name='role'>Role</label>
            <input name='role' type='text' onChange={setChangedData} value={formData.role} required></input>
            </div>

            <div>
            <button name='submit' onClick={handleSubmit}>Submit</button>
            <button name='reset' onClick={resetForm}>Reset</button>
            </div>

        </form>
    </div>
    <h2>All Employees</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Employee ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Date of Joining</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.employeeId}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.department}</td>
                            <td>{employee.datOfJoining}</td>
                            <td>{employee.role}</td>
                            <td>
                                <button onClick={() => handleEdit(employee)}>Edit</button>
                                <button onClick={() => handleDelete(employee.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </>)
}

export default EmployeeManagement;
