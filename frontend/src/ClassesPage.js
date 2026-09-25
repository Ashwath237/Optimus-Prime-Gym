import { useState, useEffect } from 'react';


function ClassesPage(){
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState([]);

    const handleBookClass = (classId) => {
        const token = localStorage.getItem('token');
        setLoading(true);
        fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ class_id: classId })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Booking response:', data);
        alert('Class booked!');
        setLoading(false);
    })
    .catch(err => {
        console.log('Booking error:', err);
        setLoading(false);
    });
};

useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/classes',{
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        console.log('Classes data:', data);
        setClasses(data.classes || []);
    })
    .catch(err => console.log(err));
}, []);
    
    return (
        <div>
            <h1>Classes</h1>
            {classes.map(cls => (
                <div key={cls.id}>
                    <h3>{cls.name}</h3>
                    <p>Trainer: {cls.trainer_id}</p>
                    <p>Time: {cls.class_time}</p>
                    <p>Capacity: {cls.capacity}</p>
                    <button onClick={() => handleBookClass(cls.id)}>Book Class</button>
                </div>
            ))}
        </div>
    );
}
export default ClassesPage;