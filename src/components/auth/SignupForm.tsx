
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { registerUser } from "@/lib/authService";
import { RefreshCcw } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  notRobot: z.boolean().refine((val) => val === true, {
    message: "Please verify that you're not a robot",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: (user: any) => void;
  onSwitchMode: () => void;
}

export default function SignupForm({ onSuccess, onSwitchMode }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Math.floor(1000 + Math.random() * 9000).toString());

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
      notRobot: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      const user = await registerUser(data.name, data.email, data.password);
      onSuccess(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateCode = () => {
    setVerificationCode(Math.floor(1000 + Math.random() * 9000).toString());
  };

  return (
    <div className="space-y-4 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Human verification */}
          <div className="border rounded-md p-4 bg-gray-50">
            <p className="text-sm font-medium mb-2">Verify you're not a robot</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white p-2 rounded border text-lg font-mono tracking-wider">
                {verificationCode}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={regenerateCode}
              >
                <RefreshCcw size={16} />
              </Button>
            </div>
            <FormField
              control={form.control}
              name="notRobot"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I can see the verification code
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <button
          onClick={onSwitchMode}
          className="text-certigen-blue hover:underline font-medium"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
