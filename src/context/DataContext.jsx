// src/context/DataContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Function to refresh data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clear API cache to ensure fresh data
      api.clearCache();
      
      // Fetch users
      const usersData = await api.getUsers();
      setUsers(usersData);
      
      // Check if we're using mock data
      if (Object.keys(usersData).length === 5 && usersData["1"] === "Alex Johnson") {
        console.info('Using mock data due to API connection issues');
        setUsingMockData(true);
      } else {
        setUsingMockData(false);
      }
      
      // Fetch all posts for all users
      const postsData = await api.getAllPosts(usersData);
      
      // Sort posts by ID (assuming higher ID means newer post)
      const sortedPosts = [...postsData].sort((a, b) => b.id - a.id);
      setAllPosts(sortedPosts);
      
      // Get posts with comment counts
      const postsWithCommentsData = await api.getPostsWithCommentCounts(postsData);
      setPostsWithComments(postsWithCommentsData);
      
      // Calculate top users based on comments on their posts
      calculateTopUsers(postsWithCommentsData, usersData);
      
      // Find trending posts (posts with max comments)
      findTrendingPosts(postsWithCommentsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error in data fetching:', err);
      setError('Failed to fetch data. The application will use demo data until the connection is restored.');
      setLoading(false);
      
      // Try to use mock data as a fallback
      try {
        const mockUsers = await api.getUsers(); // Will return mock data when API fails
        setUsers(mockUsers);
        setUsingMockData(true);
        
        const mockPosts = await api.getAllPosts(mockUsers);
        const sortedMockPosts = [...mockPosts].sort((a, b) => b.id - a.id);
        setAllPosts(sortedMockPosts);
        
        const mockPostsWithComments = await api.getPostsWithCommentCounts(mockPosts);
        setPostsWithComments(mockPostsWithComments);
        
        calculateTopUsers(mockPostsWithComments, mockUsers);
        findTrendingPosts(mockPostsWithComments);
      } catch (fallbackError) {
        console.error('Failed to load mock data:', fallbackError);
      }
    }
  }, []);

  // Calculate top 5 users with most commented posts
  const calculateTopUsers = (postsWithComments, users) => {
    // Create a map to efficiently store user comment counts
    const userCommentCounts = new Map();
    
    // Count comments for each user's posts
    postsWithComments.forEach(post => {
      const userId = post.userid;
      userCommentCounts.set(
        userId, 
        (userCommentCounts.get(userId) || 0) + post.commentsCount
      );
    });
    
    // Convert to array and sort by comment count
    const sortedUsers = Array.from(userCommentCounts.entries())
      .map(([userId, commentCount]) => ({
        id: userId,
        name: users[userId] || `User ${userId}`,
        commentCount: commentCount,
        // Generate a random but consistent avatar color for each user
        avatarColor: `hsl(${parseInt(userId, 10) * 137.5 % 360}, 70%, 50%)`
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5); // Get top 5
    
    setTopUsers(sortedUsers);
  };

  // Find posts with maximum comments
  const findTrendingPosts = (postsWithComments) => {
    if (postsWithComments.length === 0) {
      setTrendingPosts([]);
      return;
    }
    
    // Find the maximum comment count
    const maxComments = Math.max(...postsWithComments.map(post => post.commentsCount));
    
    // Filter posts with maximum comments
    const trending = postsWithComments
      .filter(post => post.commentsCount === maxComments)
      .sort((a, b) => b.commentsCount - a.commentsCount);
    
    setTrendingPosts(trending);
  };

  // Initial data fetch
  useEffect(() => {
    refreshData();
    
    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshData]);

  return (
    <DataContext.Provider
      value={{
        users,
        allPosts,
        postsWithComments,
        topUsers,
        trendingPosts,
        loading,
        error,
        usingMockData,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;