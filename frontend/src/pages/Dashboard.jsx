import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    // Implement the logout function
    const logout = () => { 
        navigate("/") 
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}