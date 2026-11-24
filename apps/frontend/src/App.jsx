import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      age: "",
    })
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GET Api - Retrieve all Users
      const fetchUsers = async () => {
        try{
          setLoading(true);
          setError("");

          const response = await fetch(`${API_URL}/api/users`);

          if(!response.ok) {
            throw new Error("Failed to fetch users");
          }

          const data = await response.json();
          setUsers(data.users);
        }
        catch (err) {
          setError(err.message);
        }
        finally {
          setLoading(false);
        }
      }

      // POST Api - Create a new user
      const handleSubmit = async(e) => {
        e.preventDefault();

        try{
          setError("");

          const response = await fetch(
            `${API_URL}/api/users`,
            {
              method: "POST",
              headers: {
                "Content-Type" : "application/json"
              },
              body: JSON.stringify({
                ...formData,
                age: Number(formData.age),
              })
            }
          );

          const data = await response.json();

          if(!response.ok) {
            throw new Error(data.message || "Failed to create user");
          }

          alert("User created successfully");

          setFormData({
            name: "",
            email: "",
            age: "",
          })

          fetchUsers();
        } catch (err) {
          setError(err.message);
        }
      };

      // Handle input change
      const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      };

      // GET - get user by ID
      const getUserById = async (id) => {
        try{
          const response = await fetch(`${API_URL}/api/users/${id}`);
          if(!response.ok) {
            throw new Error("Failed to fetch user by ID");
          }
          const data = await response.json();
          setSelectedUser(data.user);
        } catch (err) {
          setError(err.message);
          setSelectedUser(null);      
        }
      }

      // PUT - Update user by ID
      const updateUser = async (id) => {
        try{
          setError("");

          const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              age: Number(formData.age),
            }),
          });

          const data = await response.json();

          if(!response.ok){
            throw new Error(data.message || "Failed to update user");
          }
          alert("User updated successfully");
          setSelectedUser(null);

          setFormData({
            name: "",
            email: "",
            age: "",
          })

          await fetchUsers();

        } catch (err) {
          setError(err.message);
        }
      }

      // Fetch users when component mounts
      useEffect(() => {
        const loadUsers = async () => {
          try {
            setLoading(true);
            setError("");

            const response = await fetch(
              `${API_URL}/api/users`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data.users);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        loadUsers();
      }, [API_URL]);
      
      const handleEdit = (user) => {
        setSelectedUser(user);

        setFormData({
          name: user.name,
          email: user.email,
          age: user.age,
        });
      };

      const handleUpdate = (e) => {
        e.preventDefault();
        if(selectedUser) {
          updateUser(selectedUser._id);
        }
      }

      // DELETE - delete user by ID
      const deleteUser = async (id) => {
        try{
          const response = await fetch(`${API_URL}/api/users/${id}`,
          {
            method: "DELETE",
          });
           const data = await response.json();

           if(!response.ok){
            throw new Error(data.message || "Failed to delete user")
           }
           alert("User deleted successfully");

           //Refresh users after deletion
           await fetchUsers();

           // Clear selected user if the deleted user was beign viewd
           if(selectedUser?._id === id){
              setSelectedUser(null);
           }
        }
        catch(err) {
          setError(err.message);
        }
      }

    return (
    <>
      <div className="container">
        <h1>User Management</h1>

        <h2>Add User</h2>

 {/* Form to add a new user */}
        <form onSubmit = {handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            required
            value={formData.name}
            onChange={handleChange} />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required
            value={formData.email}
            onChange={handleChange} />
          <input 
            type="number" 
            name="age" 
            placeholder="Age" 
            required
            value={formData.age}
            onChange={handleChange} />

          <button type="submit">Add User</button>
        </form>

        {error && <p className="error">{error}</p>}

        <h2>All users({users.length})</h2>

<button onClick={fetchUsers}>Refresh users</button>

{loading && <p>Loading users...</p>}

{
  users.map((user) => {
    return(
      <div key = {user._id}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user.age}</p>
        <button onClick={() => getUserById(user._id)}>View details</button>
        <button onClick={() => handleEdit(user)}>Edit User</button>
        <button onClick={() => deleteUser(user._id)}>Delete User</button>
      </div>
    )
  })
}
{
  selectedUser && (
    <div>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {selectedUser.name}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Age:</strong> {selectedUser.age}</p>
    </div>
  )
}
{
  selectedUser && (
    <div>
      <h2>Edit User</h2>
      <form>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          required
          value={formData.name}
          onChange={handleChange}
          />
          <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required
          value={formData.email}
          onChange={handleChange}
          />
          <input 
          type="number" 
          name="age" 
          placeholder="Age" 
          required
          value={formData.age}
          onChange={handleChange}
          />
          <button type="submit" onClick={handleUpdate}>Update User</button>
          <button type="button" onClick={() =>{
            setSelectedUser(null);
            setFormData({
              name:"",
              email:"",
              age:"",
            });
          }}>Cancel</button>
      </form>
    </div>
  )
}

      </div>
    </>
  )
}

export default App;
