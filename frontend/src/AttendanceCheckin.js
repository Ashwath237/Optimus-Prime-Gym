import React, { useState, useEffect } from 'react';

function AttendanceCheckin() {
    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Bookings for checkin:', data);
            setBookings(data.bookings || []);
        })
        .catch(err => console.log(err));
    }, []);
    
    const handleCheckin = (bookingId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/api/attendance`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ booking_id: bookingId })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Checkin response:', data);
            alert('Checked in!');
            setBookings(bookings.map(b => b.id === bookingId ? {...b, checked_in: true, checkin_time: new Date().toLocaleString()} : b));
        })
        .catch(err => console.log(err));
    };
    
    return (
        <div>
            <h1>Check-in for Classes</h1>
            {bookings.map(booking => (
                <div key={booking.id}>
                    <h3>Class {booking.class_id}</h3>
                    <p>Status: {booking.checked_in ? 'Checked In' : 'Not Checked In'}</p>
                    <p>Check-in Time: {booking.checkin_time || 'N/A'}</p>
                    <button onClick={() => handleCheckin(booking.id)} disabled={booking.checked_in}>
                        {booking.checked_in ? 'Already Checked In' : 'Check In'}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AttendanceCheckin;