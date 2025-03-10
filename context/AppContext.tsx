import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  course?: string;
  year?: string;
  department?: string;
  rewardPoints: number;
  likedPosts?: string[]; 
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  organization: string;
  author: string;
  heading: string;
  body: string;
  isEvent: boolean;
  eventDate?: Date;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Reward {
  id: string;
  image: string;
  name: string;
  cost: number;
}

interface AppContextProps {
  user: User | null;
  posts: Post[];
  rewards: Reward[];
  setUser: (user: User | null) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  updateComment: (postId: string, comment: Comment) => void;
  deleteComment: (postId: string, commentId: string) => void;
  updateUser: (user: User) => void;
}

export const AppContext = createContext<AppContextProps>({
  user: null,
  posts: [],
  rewards: [],
  setUser: () => {},
  addPost: () => {},
  updatePost: () => {},
  deletePost: () => {},
  likePost: () => {},
  unlikePost: () => {},
  addComment: () => {},
  updateComment: () => {},
  deleteComment: () => {},
  updateUser: () => {},
});

// --- Helper Validation Functions ---
const isValidUser = (user: User): boolean => {
  if (!user.username || typeof user.username !== 'string') return false;
  if (!user.email || typeof user.email !== 'string') return false;
  if (!user.password || typeof user.password !== 'string') return false;
  if (typeof user.rewardPoints !== 'number' || isNaN(user.rewardPoints) || user.rewardPoints < 0) return false;
  return true;
};

const isValidPost = (post: Post): boolean => {
  if (!post.id || typeof post.id !== 'string') return false;
  if (!post.organization || typeof post.organization !== 'string') return false;
  if (!post.author || typeof post.author !== 'string') return false;
  if (!post.heading || typeof post.heading !== 'string') return false;
  if (!post.body || typeof post.body !== 'string') return false;
  if (!(post.createdAt instanceof Date)) return false;
  if (typeof post.likes !== 'number' || post.likes < 0) return false;
  if (!Array.isArray(post.comments)) return false;
  return true;
};

const isValidComment = (comment: Comment): boolean => {
  if (!comment.id || typeof comment.id !== 'string') return false;
  if (!comment.author || typeof comment.author !== 'string') return false;
  if (!comment.content || typeof comment.content !== 'string') return false;
  if (!(comment.createdAt instanceof Date)) return false;
  return true;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [rewards] = useState<Reward[]>([
    {
      id: 'reward1',
      image: 'https://via.placeholder.com/150',
      name: 'Reward 1',
      cost: 100,
    },
    {
      id: 'reward2',
      image: 'https://via.placeholder.com/150',
      name: 'Reward 2',
      cost: 200,
    },
    // add more rewards as needed
  ]);

  // Load user from local storage on startup
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (isValidUser(parsedUser)) {
            setUser(parsedUser);
          } else {
            console.error('Stored user data is invalid');
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
    })();
  }, []);

  // Load posts from local storage on startup
  useEffect(() => {
    (async () => {
      try {
        const storedPosts = await AsyncStorage.getItem('posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error('Error loading posts from storage:', error);
      }
    })();
  }, []);

  // Save posts to AsyncStorage whenever posts changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('posts', JSON.stringify(posts));
      } catch (error) {
        console.error('Error saving posts to storage:', error);
      }
    })();
  }, [posts]);

  // Function to add a new post
  const addPost = (post: Post) => {
    if (!isValidPost(post)) {
      console.error('Invalid post data:', post);
      return;
    }
    setPosts((prev) => [post, ...prev]);
  };

  // Update post
  const updatePost = (updatedPost: Post) => {
    if (!isValidPost(updatedPost)) {
      console.error('Invalid post data:', updatedPost);
      return;
    }
    const postExists = posts.some((post) => post.id === updatedPost.id);
    if (!postExists) {
      console.error('Post not found for update with id:', updatedPost.id);
      return;
    }
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  // Delete post
  const deletePost = (postId: string) => {
    if (!postId || typeof postId !== 'string') {
      console.error('Invalid post id:', postId);
      return;
    }
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  // Like post
  const likePost = (postId: string) => {
    if (!postId || typeof postId !== 'string') {
      console.error('Invalid post id:', postId);
      return;
    }
    if (!user) {
      console.error('User not found');
      return;
    }
  
    const likedPosts = user.likedPosts || [];
    if (likedPosts.includes(postId)) {
      console.error('User has already liked this post:', postId);
      return;
    }
  
    let postFound = false;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          postFound = true;
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      })
    );
  
    if (!postFound) {
      console.error('Post not found for liking with id:', postId);
      return;
    }
  
    const currentPoints = Number(user.rewardPoints) || 0;
    const updatedUser = {
      ...user,
      rewardPoints: currentPoints + 1,
      likedPosts: [...likedPosts, postId],
    };
  
    if (!isValidUser(updatedUser)) {
      console.error('Updated user data is invalid:', updatedUser);
      return;
    }
  
    setUser(updatedUser);
    (async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user in storage:', error);
      }
    })();
  };

  // Unlike post
  const unlikePost = (postId: string) => {
    if (!postId || typeof postId !== 'string') {
      console.error('Invalid post id:', postId);
      return;
    }
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    const likedPosts = user.likedPosts || [];
    if (!likedPosts.includes(postId)) {
      console.error('User has not liked this post:', postId);
      return;
    }
    
    let postFound = false;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          postFound = true;
          return { ...post, likes: post.likes > 0 ? post.likes - 1 : 0 };
        }
        return post;
      })
    );
    
    if (!postFound) {
      console.error('Post not found for unliking with id:', postId);
      return;
    }
    
    const updatedLikedPosts = likedPosts.filter(id => id !== postId);
    const currentPoints = Number(user.rewardPoints) || 0;
    const updatedUser = {
      ...user,
      rewardPoints: currentPoints > 0 ? currentPoints - 1 : 0,
      likedPosts: updatedLikedPosts,
    };
    
    setUser(updatedUser);
    (async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user in storage:', error);
      }
    })();
  };

  // Add comment to post
  const addComment = (postId: string, comment: Comment) => {
    if (!postId || typeof postId !== 'string') {
      console.error('Invalid post id:', postId);
      return;
    }
    if (!isValidComment(comment)) {
      console.error('Invalid comment data:', comment);
      return;
    }
    const postExists = posts.some((post) => post.id === postId);
    if (!postExists) {
      console.error('Post not found for adding comment with id:', postId);
      return;
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  // Update comment
  const updateComment = (postId: string, updatedComment: Comment) => {
    if (!postId || typeof postId !== 'string') {
      console.error('Invalid post id:', postId);
      return;
    }
    if (!isValidComment(updatedComment)) {
      console.error('Invalid comment data:', updatedComment);
      return;
    }
    let commentFound = false;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((c) => {
            if (c.id === updatedComment.id) {
              commentFound = true;
              return updatedComment;
            }
            return c;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
    if (!commentFound) {
      console.error('Comment not found for update in post with id:', postId, 'comment id:', updatedComment.id);
    }
  };

  // Delete comment
  const deleteComment = (postId: string, commentId: string) => {
    if (!postId || typeof postId !== 'string' || !commentId || typeof commentId !== 'string') {
      console.error('Invalid post id or comment id:', postId, commentId);
      return;
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
          : post
      )
    );
  };

  // Update user profile
  const updateUser = (updatedUser: User) => {
    if (!isValidUser(updatedUser)) {
      console.error('Invalid user data:', updatedUser);
      return;
    }
    setUser(updatedUser);
    (async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user in storage:', error);
      }
    })();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        posts,
        rewards,
        setUser,
        addPost,
        updatePost,
        deletePost,
        likePost,
        unlikePost,
        addComment,
        updateComment,
        deleteComment,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
