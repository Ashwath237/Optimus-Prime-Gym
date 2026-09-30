import { useState, useEffect } from 'react';


function TrainersPage(){
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);


useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:3001/api/trainers',{
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        console.log('Trainers data:', data);
        setTrainers(data.trainers || []);
        setLoading(false); 
    })
    .catch(err => console.log(err));

}, []);
    
    return (
        <div>
            <h1>Trainers</h1>
            {loading && <p>Loading...</p>}
            {trainers.map(trainer => (
                <div key={trainer.id}>
                    <h3>{trainer.name}</h3>
                    <p>Specialization: {trainer.specialization}</p>
                    <p>Availability: {trainer.availability}</p>
                    
                </div>
            ))}
        </div>
    );
}
export default TrainersPage;