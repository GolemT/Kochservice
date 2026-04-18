import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/signup-form'

export function Auth() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  )
}
