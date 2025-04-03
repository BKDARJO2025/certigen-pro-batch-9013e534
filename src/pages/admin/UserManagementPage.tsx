
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/lib/authService";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  
  useEffect(() => {
    // Load users from localStorage
    const loadedUsers = JSON.parse(localStorage.getItem("lovable.dev.users") || "[]");
    // Remove passwords for security
    const sanitizedUsers = loadedUsers.map(({ password, ...user }: any) => user);
    setUsers(sanitizedUsers);
  }, []);

  const handleAddUser = () => {
    if (!validateForm()) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
    };
    
    // Add to stored users with a default password
    const storedUsers = JSON.parse(localStorage.getItem("lovable.dev.users") || "[]");
    const newStoredUser = { ...newUser, password: "password123" };
    localStorage.setItem("lovable.dev.users", JSON.stringify([...storedUsers, newStoredUser]));
    
    // Update UI with sanitized user (no password)
    setUsers([...users, newUser]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("User added successfully");
  };

  const handleEditUser = () => {
    if (!selectedUser || !validateForm()) return;
    
    const updatedUser = {
      ...selectedUser,
      name,
      email,
      role,
    };
    
    // Update in localStorage
    const storedUsers = JSON.parse(localStorage.getItem("lovable.dev.users") || "[]");
    const updatedStoredUsers = storedUsers.map((user: any) => 
      user.id === selectedUser.id ? { ...user, name, email, role } : user
    );
    localStorage.setItem("lovable.dev.users", JSON.stringify(updatedStoredUsers));
    
    // Update UI
    setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    // Remove from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("lovable.dev.users") || "[]");
    const filteredUsers = storedUsers.filter((user: any) => user.id !== userId);
    localStorage.setItem("lovable.dev.users", JSON.stringify(filteredUsers));
    
    // Update UI
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsEditDialogOpen(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("user");
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>Add New User</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditDialog(user)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={(value: "user" | "admin") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
              <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role" className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={(value: "user" | "admin") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
