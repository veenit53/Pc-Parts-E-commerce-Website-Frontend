import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/seperator";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

type FormErrors = {
  email?: string
  password?: string
}

export function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const navigate = useNavigate()

  const validate = () => {

    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password cannot be empty"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (validate()) {

      console.log("Login data:", { email, password })

      try{
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if(!response.ok){
          alert(data.message)
          return
        }

        console.log("Login successful:", data)
        
        localStorage.setItem("token", data.token)

        navigate("/")

      } catch (error) {
        console.error("Login error:", error)
        alert("An error occurred during login. Please try again.")

      }
    }
  }

  return (

    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo / Brand */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-white tracking-tight">
            PC<span className="text-[#22c55e]">Forge</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Build your dream gaming PC
          </p>

        </div>


        <Card className="bg-[#111827] border-gray-800 shadow-xl rounded-xl">

          <CardHeader>

            <CardTitle className="text-white text-xl">
              Login
            </CardTitle>

            <CardDescription className="text-gray-400">
              Access your account
            </CardDescription>

          </CardHeader>


          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-5">


              {/* Email */}

              <div className="space-y-2">

                <Label className="text-gray-300">
                  Email
                </Label>

                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
                />

                {errors.email && (
                  <p className="text-sm text-red-400">
                    {errors.email}
                  </p>
                )}

              </div>


              {/* Password */}

              <div className="space-y-2">

                <div className="flex justify-between">

                  <Label className="text-gray-300">
                    Password
                  </Label>

                  <span className="text-sm text-[#22c55e] hover:underline cursor-pointer">
                    Forgot?
                  </span>

                </div>

                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
                />

                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password}
                  </p>
                )}

              </div>


              {/* Login Button */}

              <Button
                type="submit"
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold"
              >
                Sign In
              </Button>

            </form>


            <Separator className="my-6 bg-gray-800"/>


            {/* Social login */}

            <div className="grid grid-cols-2 gap-4">

              <Button variant="outline" className="border-gray-700 text-gray-200">
                Google
              </Button>

              <Button variant="outline" className="border-gray-700 text-gray-200">
                GitHub
              </Button>

            </div>


            {/* Register */}

            <div className="mt-6 text-center text-sm text-gray-400">

              Don’t have an account?

              <Link
                to="/register"
                className="ml-1 text-[#22c55e] hover:underline"
              >
                Create account
              </Link>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  )
}