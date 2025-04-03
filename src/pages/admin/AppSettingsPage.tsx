
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const settingsSchema = z.object({
  appName: z.string().min(2, "App name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  supportEmail: z.string().email("Please enter a valid email"),
  defaultCertificateSize: z.string(),
  maxUploadSizeMB: z.coerce.number().positive().min(1, "Must be at least 1 MB"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AppSettingsPage() {
  // Load settings from localStorage or use defaults
  const loadSettings = (): SettingsFormValues => {
    const storedSettings = localStorage.getItem("lovable.dev.app-settings");
    
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    
    return {
      appName: "CertiGen Pro",
      companyName: "CertiGen Inc.",
      supportEmail: "support@certigen.com",
      defaultCertificateSize: "A4",
      maxUploadSizeMB: 10,
    };
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: loadSettings,
  });

  const onSubmit = (data: SettingsFormValues) => {
    // Save to localStorage
    localStorage.setItem("lovable.dev.app-settings", JSON.stringify(data));
    toast.success("Settings saved successfully");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Application Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure the general settings for the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be displayed in the header and emails
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Used for legal documentation and footers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email for customer support inquiries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="defaultCertificateSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Certificate Size</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          {...field}
                        >
                          <option value="A4">A4</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                          <option value="Tabloid">Tabloid</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Default paper size for new certificates
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxUploadSizeMB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Upload Size (MB)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum file size for template uploads
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system statistics and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Registered Users</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Templates</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium">24 MB</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span className="font-medium">Never</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">Run System Diagnostics</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>
                System maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">Clear Cache</Button>
                <Button variant="outline" className="w-full">Backup Data</Button>
                <Button variant="destructive" className="w-full">Reset Application</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
