import React, { useState, useEffect } from 'react';

function MemberBookings() {
    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Bookings data:', data);
            setBookings(data.bookings || []);
        })
        .catch(err => console.log(err));
    }, []);
    
    const handleCancelBooking = (bookingId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        console.log('Cancel response:', data);
        alert('Booking cancelled!');
        setBookings(bookings.filter(b => b.id !== bookingId));
    })
    .catch(err => console.log(err));
};
    
    return (
        <div>
            <h1>My Bookings</h1>
            {bookings.map(booking => (
                <div key={booking.id}>
                    <h3>{booking.class_name || booking.class_id || 'Class'}</h3>
                    <p>Status: {booking.status}</p>
                    <p>Trainer: {booking.trainer_id}</p>
                    <p>Time: {booking.class_time}</p>
                    <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
                </div>
            ))}
        </div>
    );
}

export default MemberBookings;