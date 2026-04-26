import React from 'react'
import { SignInButton, SignOutButton , SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PenBox,
  
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import { checkUser } from '@/lib/checkUser'


const Header = async() => {
  await checkUser();
  return (
       <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60" >
     <nav className='container flex mx-auto px-4 h-16 items-center justify-between'>
  
   
        <Link href="/">
        <Image className=" h-12 py-1 w-auto object-contain" src="/jobPrep-logo.svg" width={120} height={40} alt="JobPrep Logo" />
        </Link>
        <div className="flex gap-3">
        <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              {/* Show the user button when the user is signed in */}
              <SignedIn>
                <Link href="/dashboard">
                <Button>
                  <LayoutDashboard className='h-4 w-4' />
                <span className="hidden md:block">Industry Insights</span>
                  </Button>
                </Link>
                    <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <UserButton />
            </Button>
              </SignedIn>
     </div>      
    </nav>
    </header>
  )
}

export default Header
