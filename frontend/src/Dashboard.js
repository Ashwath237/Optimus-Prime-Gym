import { useState, useEffect } from 'react';
import ClassesPage from './ClassesPage';
import MemberBookings from './MemberBookings';
import AttendanceCheckin from './AttendanceCheckin';
import BodyMetrics from './BodyMetrics';
import TrainersPage from './TrainersPage';


function Dashboard() {
    const [memberData, setMemberData] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
        
        console.log('Token found, fetching member data...');
        fetch('http://localhost:3001/api/members', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        .then(res => res.json())
        
        .then(data => {
            console.log('Member data:', data);
            setMemberData(data);
        })
        
        .catch(err => console.log('Error:', err));
    }, []);

return (
<div>
    <nav>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('classes')}>Classes</button>
        <button onClick={() => setCurrentPage('bookings')}>My Bookings</button>
        <button onClick={() => setCurrentPage('attendance')}>Check-in</button>
        <button onClick={() => setCurrentPage('metrics')}>Body Metrics</button>
        <button onClick={() => setCurrentPage('trainers')}>Trainers</button>
        </nav>
    
    {currentPage === 'dashboard' && (
        <div>
            <h1>Dashboard</h1>
            {memberData ? <pre>{JSON.stringify(memberData, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    )}
    {currentPage === 'classes' && <ClassesPage />}
    {currentPage === 'bookings' && <MemberBookings />}
    {currentPage === 'attendance' && <AttendanceCheckin />}
    {currentPage === 'metrics' && <BodyMetrics />}
    {currentPage === 'trainers' && <TrainersPage/>}
    </div>
    );
    

}

export default Dashboard;