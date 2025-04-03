
// Mock authentication service

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Local storage keys
const USER_KEY = "lovable.dev.user";
const USERS_KEY = "lovable.dev.users";

// Initialize mock users if they don't exist
export const initAuthService = () => {
  const users = localStorage.getItem(USERS_KEY);
  
  if (!users) {
    const initialUsers = [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@certigen.com",
        password: "admin123", // In a real app, this would be hashed
        role: "admin" as const
      },
      {
        id: "user-1",
        name: "Regular User",
        email: "user@example.com",
        password: "password123", // In a real app, this would be hashed
        role: "user" as const
      }
    ];
    
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
};

// User registration
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  // Check if user already exists
  if (users.some((user: any) => user.email === email)) {
    throw new Error("User already exists");
  }
  
  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In a real app, this would be hashed
    role: "user" as const
  };
  
  // Add to users list
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// User login
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  // Find user with matching credentials
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Store current user in localStorage
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};
