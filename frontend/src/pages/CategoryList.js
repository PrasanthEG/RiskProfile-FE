import { useState ,useEffect} from "react";
import { API_BASE_URL } from "./../config";

const CategoryList = () => {
    // Sample data
   
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const fetchCategories = async (page) => {
        try {


            const token = localStorage.getItem("token"); // Get the token from local storage or session storage
            if (!token) {
                setError("Unauthorized: No token found");
                setLoading(false);
                return;
            }
            const response =await fetch(`${API_BASE_URL}/paginated_categories?page=${page}&per_page=5`, {
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
           
            setCategories(data.categories);
            setTotalPages(data.totalPages);
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

    

    // Pagination logic
   



    // Edit and Toggle Active Status
    const editCategory = (id) => alert(`Editing category ${id}`);
    const toggleCategoryStatus = (id) => {
        setCategories(categories.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat));
    };

    return (
        <div className="grid-item">
            <h2>Themes</h2>
            <div className="grid-content">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                       
                    </tr>
                </thead>
                <tbody>
                   
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.name}</td>
                            
                            <td>{cat.description}</td>
                            <td>{cat.active ? "Active" : "Inactive"}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <a href="/categories" className="add-user-link">Manage Themes</a>
            <div className="pagination-footer">
            
                <div className="pagination">
                    <button className="button-link" disabled={currentPage === 1} onClick={() => fetchCategories(currentPage - 1)}>Prev</button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button className="button-link" disabled={currentPage === totalPages} onClick={() => fetchCategories(currentPage + 1)}>Next</button>
                </div>
            </div>
        
        </div>
    );
};

export default CategoryList;
