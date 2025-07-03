import axios from "@/lib/axios"

// Auth
export const registerUser = (data: {
  fullName: string
  email: string
  password: string
}) => axios.post("/api/auth/register", data)

export const loginUser = (data: {
  email: string
  password: string
}) => axios.post("/api/auth/login", data)

export const getCurrentUser = () => axios.get("/api/auth/me");

export const logoutUser = () => axios.post("/api/auth/logout");

// Collab
export const createCollabPost = (data: any) => axios.post("/api/collab/create", data);

export const fetchPublicCollabPosts = () => axios.get("/api/collab/all");

export const applyToCollabPost = (postId: string, message: string) => axios.post(`/api/collab/apply/${postId}`, { message });

export const fetchCollabPostById = (postId: string) => axios.get(`/api/collab/${postId}`);

export const getAllUserCollabPosts = () => axios.get('/api/collab/my-posts');

// Post
export const createPost = (data: any) => axios.post("/api/post/create", data);

export const fetchPublicPosts = () => axios.get("/api/post/all");

export const fetchPostById = (postId: string) => axios.get(`/api/post/${postId}`);

export const getAllUserPosts = () => axios.get('/api/post/my-posts');

// User

export const fetchUserByUsername = (username: string) => axios.get(`/api/user/${username}`);

export const toggleFollowUser = (userId: string) => axios.patch(`/api/user/follow/${userId}`);

export const getAllPublicUserPosts = (userId: string) => axios.get(`/api/user/posts/${userId}`);

export const getAllPublicUserCollabPosts = (userId: string) => axios.get(`/api/user/collabs/${userId}`);