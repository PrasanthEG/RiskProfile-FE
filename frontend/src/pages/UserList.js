import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./../config";


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 5;

   
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {


            const token = localStorage.getItem("token"); // Get the token from local storage or session storage
           
            if (!token) {
                setError("Unauthorized: No token found");
                setLoading(false);
                return;
            }
            const response =await fetch(`${API_BASE_URL}/get_users?page=${page}&per_page=5`, {
               
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // Add JWT token here
                }
            })
           
            if (response.status === 401) {  // Token expired or invalid
                alert("Session timed out. Please log in again.");
                localStorage.removeItem("token");  // Remove expired token
                window.location.href = "/";  // Redirect to login
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.total_pages);
            setCurrentPage(data.current_page);

            

        } catch (error) {
            console.error("Error fetching USER LIST:", error);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const editUser = (id) => alert(`Editing User ${id}`);
    const toggleUserStatus = (id) => {
        setUsers(users.map(usr => usr.id === id ? { ...usr, active: !usr.active } : usr));
    };

    return (
        <div className="grid-item">
            <h2>Admin Users</h2>
            <div className="grid-content">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th className="align_right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.firstname} {user.lastname}</td>
                                <td>{user.email}</td>
                                <td className="align_right">
                                    {user.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <a href="/users" className="add-user-link">Manage Users</a> 
            <div className="pagination-footer">
                <div className="pagination">
                    <button className="button-link" disabled={currentPage === 1} onClick={() => fetchUsers(currentPage - 1)}>Prev</button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button className="button-link" disabled={currentPage === totalPages} onClick={() => fetchUsers(currentPage + 1)}>Next</button>
                </div>
            </div>

           


           
        </div>
    );
};

export default UserList;
