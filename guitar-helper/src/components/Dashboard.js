import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const Dashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsCollection = await getDocs(collection(db, 'lessons'));
      setLessons(lessonsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

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
    // Outer Box for the full screen background
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column" // Changed to column to allow content to stack
      alignItems="center"
      justifyContent="flex-start" // Align items to the top
      p={8} // Add padding around the whole page
      backgroundImage="url('https://images.unsplash.com/photo-1510915362895-4184166ce349?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" // Another guitar image
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* Inner Box for the actual dashboard content */}
      <Box
        maxW="container.md"
        width="100%" // Ensure it takes full width within maxW
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="whiteAlpha.800" // Semi-transparent white background
        backdropFilter="blur(8px)" // Frosted glass effect
      >
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading as="h1" size="lg">Dashboard</Heading>
          <Button onClick={handleLogout} colorScheme="red" variant="outline">Logout</Button>
        </Flex>

        <Text mb={8}>Welcome, {auth.currentUser?.email}!</Text>

        <Heading as="h2" size="md" mb={4}>Lessons</Heading>

        <VStack spacing={4} align="stretch">
          {lessons.length > 0 ? (
            lessons.map(lesson => (
              <Box
                as={Link}
                to={`/lesson/${lesson.id}`}
                key={lesson.id}
                p={5}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">{lesson.title}</Text>
                  {completed.includes(lesson.id) && (
                    <Icon as={CheckCircleIcon} color="green.500" w={5} h={5} />
                  )}
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No lessons found. Add some in your Firebase console!</Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;