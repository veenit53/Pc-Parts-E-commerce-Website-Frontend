import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/seperator"

type FormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export function RegisterPage() {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [terms,setTerms] = useState(false)

  const [errors,setErrors] = useState<FormErrors>({})
  const [success,setSuccess] = useState("")

  const navigate = useNavigate()

  const validate = () => {

    const newErrors:FormErrors = {}

    if(!name){
      newErrors.name = "Name is required"
    }

    if(!email){
      newErrors.email = "Email is required"
    }
    else if(!/\S+@\S+\.\S+/.test(email)){
      newErrors.email = "Enter a valid email"
    }

    if(!password){
      newErrors.password = "Password is required"
    }
    else if(password.length < 6){
      newErrors.password = "Password must be at least 6 characters"
    }

    if(!confirmPassword){
      newErrors.confirmPassword = "Confirm your password"
    }
    else if(password !== confirmPassword){
      newErrors.confirmPassword = "Passwords do not match"
    }

    if(!terms){
      newErrors.terms = "You must accept terms"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    if(validate()){

      const userData = {
        name,
        email,
        password
      }

      try{
        const response = await fetch("http://localhost:5000/api/register",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        })
        
        const data = await response.json()

        if(!response.ok){
          setSuccess("")
          alert(data.message)
          return
        }

        setSuccess("Account created successfully! You can now log in.")
        
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setTerms(false)
        setErrors({})

        setTimeout(() => {
          navigate("/login")
        }, 1500)
      }
      catch(error){
        console.error("Registration error:", error)
        setSuccess("")
        alert("An error occurred. Please try again.")
    }
    }
  }

  return (

<div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">

<div className="w-full max-w-md">

{/* Branding */}

<div className="text-center mb-10">

<h1 className="text-4xl font-bold text-white">
PC<span className="text-[#22c55e]">Forge</span>
</h1>

<p className="text-gray-400 mt-2">
Create your builder account
</p>

</div>


<Card className="bg-[#111827] border-gray-800 shadow-xl rounded-xl">

<CardHeader>

<CardTitle className="text-white">
Create Account
</CardTitle>

<CardDescription className="text-gray-400">
Join thousands of PC builders
</CardDescription>

</CardHeader>


<CardContent>

{/* Success message */}

{success && (
<div className="mb-4 rounded-lg bg-green-500/10 border border-green-500 text-green-400 p-3 text-sm text-center">
{success}
</div>
)}

<form onSubmit={handleSubmit} className="space-y-5">

{/* Name */}

<div className="space-y-2">

<Label className="text-gray-300">Full Name</Label>

<Input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="John Smith"
className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
/>

{errors.name && (
<p className="text-red-400 text-sm">{errors.name}</p>
)}

</div>


{/* Email */}

<div className="space-y-2">

<Label className="text-gray-300">Email</Label>

<Input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="john@email.com"
className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
/>

{errors.email && (
<p className="text-red-400 text-sm">{errors.email}</p>
)}

</div>


{/* Password */}

<div className="space-y-2">

<Label className="text-gray-300">Password</Label>

<Input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Enter password"
className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
/>

{errors.password && (
<p className="text-red-400 text-sm">{errors.password}</p>
)}

</div>


{/* Confirm Password */}

<div className="space-y-2">

<Label className="text-gray-300">Confirm Password</Label>

<Input
type="password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
placeholder="Confirm password"
className="bg-[#0f172a] border-gray-700 focus-visible:ring-[#22c55e]"
/>

{errors.confirmPassword && (
<p className="text-red-400 text-sm">{errors.confirmPassword}</p>
)}

</div>


{/* Terms */}

<div className="flex items-center gap-2">

<input
type="checkbox"
checked={terms}
onChange={(e)=>setTerms(e.target.checked)}
className="accent-[#22c55e]"
/>

<p className="text-sm text-gray-400">
I agree to the <span className="text-[#22c55e] cursor-pointer">Terms</span> and <span className="text-[#22c55e] cursor-pointer">Privacy Policy</span>
</p>

</div>

{errors.terms && (
<p className="text-red-400 text-sm">{errors.terms}</p>
)}

<Button
type="submit"
className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold"
>
Create Account
</Button>

</form>


{/* Divider */}

<Separator className="my-6 bg-gray-800"/>


{/* Google login */}

<div className="text-center mb-4">
<span className="text-sm text-gray-400">Or continue with</span>
</div>

<Button
variant="outline"
className="w-full border-gray-700 text-gray-200 hover:bg-[#1e293b] flex items-center justify-center gap-2"
>

<svg className="w-5 h-5" viewBox="0 0 24 24">
<path fill="currentColor"
d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92
c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57
c2.08-1.92 3.28-4.74 3.28-8.09z"/>
<path fill="currentColor"
d="M12 23c2.97 0 5.46-.98 7.28-2.66
l-3.57-2.77c-.98.66-2.23 1.06-3.71
1.06-2.86 0-5.29-1.93-6.16-4.53H2.18
v2.84C3.99 20.53 7.7 23 12 23z"/>
<path fill="currentColor"
d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09
s.13-1.43.35-2.09V7.07H2.18
C1.43 8.55 1 10.22 1 12
s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
<path fill="currentColor"
d="M12 5.38c1.62 0 3.06.56 4.21 1.64
l3.15-3.15C17.45 2.09 14.97 1 12 1
7.7 1 3.99 3.47 2.18 7.07
l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</svg>

Continue with Google

</Button>


<div className="mt-6 text-center text-sm text-gray-400">

Already have an account?

<Link
to="/login"
className="ml-1 text-[#22c55e] hover:underline"
>
Sign in
</Link>

</div>

</CardContent>

</Card>

</div>

</div>

)
}