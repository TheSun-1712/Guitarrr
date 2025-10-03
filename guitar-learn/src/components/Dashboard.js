import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all available lessons
    const fetchLessons = async () => {
      const lessonsCollection = await getDocs(collection(db, 'lessons'));
      setLessons(lessonsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Fetch the current user's completed lessons
    const fetchUserProgress = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().completedLessons) {
          setCompleted(userDoc.data().completedLessons);
        }
      }
    };

    fetchLessons();
    fetchUserProgress();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {auth.currentUser?.email}!</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Lessons</h2>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link to={`/lesson/${lesson.id}`}>
              {lesson.title}
            </Link>
            {completed.includes(lesson.id) && <span> ✅</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;