import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebaseConfig'; // Make sure this path is correct
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

const LessonViewer = () => {
  const { lessonId } = useParams(); // Gets the lesson ID from the URL (e.g., "Em")
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // This effect runs when the component loads to fetch the lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      // Create a reference to the specific lesson document in Firestore
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);

      if (lessonSnap.exists()) {
        setLesson({ id: lessonSnap.id, ...lessonSnap.data() });
      } else {
        console.log("No such lesson found!");
      }
      setLoading(false);
    };

    fetchLesson();
  }, [lessonId]); // Re-run if the lessonId in the URL changes

  // Function to save progress to the user's document in Firestore
  const handleMarkAsComplete = async () => {
    if (!auth.currentUser) return; // Make sure a user is logged in

    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      // Use updateDoc to add the lessonId to the 'completedLessons' array.
      // arrayUnion prevents the same lesson from being added twice.
      await updateDoc(userRef, {
        completedLessons: arrayUnion(lesson.id)
      });
      setIsCompleted(true);
      alert("Progress saved!");
    } catch (error) {
       // If the user document doesn't exist, create it first
      if (error.code === 'not-found') {
        await setDoc(userRef, { completedLessons: [lesson.id] });
        setIsCompleted(true);
        alert("Progress saved!");
      } else {
        console.error("Error saving progress: ", error);
        alert("Could not save progress.");
      }
    }
  };

  if (loading) {
    return <div>Loading Lesson...</div>;
  }

  if (!lesson) {
    return <div>Lesson not found.</div>;
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '50px auto' }}>
      <h1>{lesson.title}</h1>
      <img src={lesson.gifPath} alt={lesson.title} style={{ width: '100%', border: '1px solid #ddd' }} />
      <p style={{ lineHeight: '1.6' }}>{lesson.instructions}</p>
      
      <button onClick={handleMarkAsComplete} disabled={isCompleted}>
        {isCompleted ? "Completed!" : "Mark as Complete"}
      </button>

      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default LessonViewer;