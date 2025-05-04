// src/services/api.js
// Updated with correct URL and better error handling

// API Base URL - CRITICAL: Fixed from 28.244.56.144 to 20.244.56.144
const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Credentials from your registration
const credentials = {
  email: "snehakumari64445@gmail.com",
  name: "sneha kumari",
  rollNo: "2k22csun01186",
  accessCode: "hFhJhm",
  clientID: "f3107869-b5d0-4f12-be62-e30750818391",
  clientSecret: "xnEQndpPZEHMJPDT"
};

// Authorization token received
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MzM3NDI3LCJpYXQiOjE3NDYzMzcxMjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImYzMTA3ODY5LWI1ZDAtNGYxMi1iZTYyLWUzMDc1MDgxODM5MSIsInN1YiI6InNuZWhha3VtYXJpNjQ0NDVAZ21haWwuY29tIn0sImVtYWlsIjoic25laGFrdW1hcmk2NDQ0NUBnbWFpbC5jb20iLCJuYW1lIjoic25laGEga3VtYXJpIiwicm9sbE5vIjoiMmsyMmNzdW4wMTE4NiIsImFjY2Vzc0NvZGUiOiJoRmhKaG0iLCJjbGllbnRJRCI6ImYzMTA3ODY5LWI1ZDAtNGYxMi1iZTYyLWUzMDc1MDgxODM5MSIsImNsaWVudFNlY3JldCI6InhuRVFuZHBQWkVITUpQRFQifQ.8P5y8cdoWAgUk18qNPPnLYrwg49oxCj3uZknitZP8-8";

// Use a cache to minimize API calls
const cache = {
  users: null,
  posts: {},
  comments: {},
  timestamp: {}
};

// Cache expiration time (30 seconds)
const CACHE_EXPIRY = 30000;

// Common fetch configuration with authentication
const fetchConfig = {
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long waiting
  signal: AbortSignal.timeout(5000) // 5 second timeout
};

// Mock data to use when API fails
const MOCK_DATA = {
  users: {
    "1": "Alex Johnson",
    "2": "Maria Garcia",
    "3": "John Smith",
    "4": "Sarah Williams",
    "5": "David Brown"
  },
  posts: [
    { id: 101, userid: "1", content: "Just discovered a great new coffee shop downtown!", username: "Alex Johnson" },
    { id: 102, userid: "2", content: "Working on a new project today. Excited about the possibilities!", username: "Maria Garcia" },
    { id: 103, userid: "3", content: "Beautiful sunset at the beach this evening.", username: "John Smith" },
    { id: 104, userid: "4", content: "Just finished reading an amazing book. Any recommendations?", username: "Sarah Williams" },
    { id: 105, userid: "5", content: "New tech gadget arrived today. Can't wait to try it out!", username: "David Brown" },
    { id: 106, userid: "1", content: "Planning my next vacation. Any suggestions?", username: "Alex Johnson" },
    { id: 107, userid: "2", content: "Just completed a 5K run. Personal best time!", username: "Maria Garcia" }
  ],
  comments: [
    { id: 201, postid: 101, content: "I'll have to check it out!" },
    { id: 202, postid: 101, content: "What's the name of the place?" },
    { id: 203, postid: 102, content: "Good luck with your project!" },
    { id: 204, postid: 103, content: "Gorgeous! Which beach?" },
    { id: 205, postid: 104, content: "Try 'The Midnight Library' - it's fantastic." },
    { id: 206, postid: 104, content: "I recently enjoyed 'Project Hail Mary'" },
    { id: 207, postid: 105, content: "What did you get?" },
    { id: 208, postid: 106, content: "Thailand is amazing this time of year!" },
    { id: 209, postid: 107, content: "Congratulations! That's awesome." }
  ]
};

// Utility to log API errors consistently
const logApiError = (endpoint, error) => {
  console.error(`API Error (${endpoint}):`, error);
};

// Check if cache is valid
const isCacheValid = (key) => {
  return cache.timestamp[key] && (Date.now() - cache.timestamp[key] < CACHE_EXPIRY);
};

// API service functions with caching and fallback to mock data
const api = {
  // Get all users
  getUsers: async () => {
    // Return from cache if valid
    if (isCacheValid('users') && cache.users) {
      console.log('Using cached users data');
      return cache.users;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/users`, fetchConfig);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      
      // Cache the response
      cache.users = data.users;
      cache.timestamp['users'] = Date.now();
      
      return data.users;
    } catch (error) {
      logApiError('getUsers', error);
      console.info('Falling back to mock user data');
      
      // If we had previously cached data, return that instead of mock
      if (cache.users) {
        return cache.users;
      }
      
      return MOCK_DATA.users;
    }
  },

  // Get posts for a specific user
  getUserPosts: async (userId) => {
    // Return from cache if valid
    if (isCacheValid(`posts_${userId}`) && cache.posts[userId]) {
      console.log(`Using cached posts data for user ${userId}`);
      return cache.posts[userId];
    }
    
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}/posts`, fetchConfig);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      
      // Cache the response
      cache.posts[userId] = data.posts;
      cache.timestamp[`posts_${userId}`] = Date.now();
      
      return data.posts;
    } catch (error) {
      logApiError(`getUserPosts(${userId})`, error);
      
      // If we had previously cached data, return that instead of mock
      if (cache.posts[userId]) {
        return cache.posts[userId];
      }
      
      // Return mock posts for this user
      return MOCK_DATA.posts.filter(post => post.userid === userId);
    }
  },

  // Get comments for a specific post
  getPostComments: async (postId) => {
    // Return from cache if valid
    if (isCacheValid(`comments_${postId}`) && cache.comments[postId]) {
      console.log(`Using cached comments data for post ${postId}`);
      return cache.comments[postId];
    }
    
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, fetchConfig);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      
      // Cache the response
      cache.comments[postId] = data.comments;
      cache.timestamp[`comments_${postId}`] = Date.now();
      
      return data.comments;
    } catch (error) {
      logApiError(`getPostComments(${postId})`, error);
      
      // If we had previously cached data, return that instead of mock
      if (cache.comments[postId]) {
        return cache.comments[postId];
      }
      
      // Return mock comments for this post
      return MOCK_DATA.comments.filter(comment => comment.postid === postId);
    }
  },

  // Get all posts for all users (utilized for feed)
  getAllPosts: async (users) => {
    try {
      // Try to get posts from API first
      const postsPromises = Object.keys(users).map(userId => 
        api.getUserPosts(userId).then(posts => 
          posts.map(post => ({ ...post, username: users[post.userid] || users[userId] }))
        )
      );
      
      const postsArrays = await Promise.all(postsPromises);
      return postsArrays.flat();
    } catch (error) {
      logApiError('getAllPosts', error);
      // Fallback to mock posts with username mapping
      return MOCK_DATA.posts.map(post => {
        // Make sure username is present
        if (!post.username && users[post.userid]) {
          return { ...post, username: users[post.userid] };
        }
        return post;
      });
    }
  },
  
  // Get comments count for all posts
  getPostsWithCommentCounts: async (posts) => {
    try {
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const comments = await api.getPostComments(post.id);
            return {
              ...post,
              commentsCount: comments.length,
              comments
            };
          } catch (error) {
            // Handle errors for individual posts
            logApiError(`getPostComments in getPostsWithCommentCounts(${post.id})`, error);
            
            // Try to get cached comments for this post
            if (cache.comments[post.id]) {
              return {
                ...post,
                commentsCount: cache.comments[post.id].length,
                comments: cache.comments[post.id]
              };
            }
            
            // Try to get mock comments for this post
            const mockComments = MOCK_DATA.comments.filter(comment => comment.postid === post.id);
            return {
              ...post,
              commentsCount: mockComments.length,
              comments: mockComments
            };
          }
        })
      );
      return postsWithComments;
    } catch (error) {
      logApiError('getPostsWithCommentCounts', error);
      // Full fallback to mock data
      return posts.map(post => {
        const comments = MOCK_DATA.comments.filter(comment => comment.postid === post.id);
        return {
          ...post,
          commentsCount: comments.length,
          comments
        };
      });
    }
  },
  
  // Clear cache to force refresh data
  clearCache: () => {
    cache.users = null;
    cache.posts = {};
    cache.comments = {};
    cache.timestamp = {};
    console.log('Cache cleared');
  }
};

export default api;