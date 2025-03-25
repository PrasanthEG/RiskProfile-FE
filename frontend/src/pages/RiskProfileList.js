import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./../config";


const RiskProfileList = () => {
    const [riskProfiles, setRiskProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    

    useEffect(() => {
        fetchRiskProfiles(currentPage);
    }, [currentPage]);

    const fetchRiskProfiles = async (page) => {
        try {


            const token = localStorage.getItem("token"); // Get the token from local storage or session storage
            if (!token) {
                setError("Unauthorized: No token found");
                setLoading(false);
                return;
            }

            const response =await fetch(`${API_BASE_URL}/risk_profiles?page=${page}&per_page=5`, {
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
            setRiskProfiles(data.risk_profiles);
            setTotalPages(data.total_pages);
            setCurrentPage(data.current_page);

            

        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    const editRisk = (id) => alert(`Editing Risks ${id}`);
    const toggleRiskStatus = (id) => {
        setUsers(riskProfiles.map(rsk => rsk.id === id ? { ...rsk, active: !rsk.active } : rsk));
    };

    return (
        <div className="grid-item span-2">
            <h2>Risk Profiles</h2>
            <div className="grid-content">
            <table>
                <thead>
                    <tr>
                        <th>Profile Name</th>
                        <th>Description</th>
                        <th>Score Threshold</th>
                        <th>Status</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {riskProfiles.map((profile) => (
                        <tr key={profile.id}>
                            <td>{profile.profile_name}</td>
                            <td>{profile.description}</td>
                            <td>{profile.score_threshold}</td>
                            <td>{profile.status}</td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>            
            {/* Pagination Controls */}
            <a href="/risk-profiles" className="add-user-link">Manage Risk Profile</a> 
            <div className="pagination-footer">
                <button 
                    className="button-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="pagination-text"> Page {currentPage} of {totalPages} </span>
                <button 
                    className="button-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

          
        </div>
    );
};

export default RiskProfileList;
