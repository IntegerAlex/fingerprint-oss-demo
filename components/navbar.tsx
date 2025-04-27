import type React from "react"
import Link from "next/link"
import { Fingerprint } from "lucide-react"
import Image from "next/image"
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
	  <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-8 w-8" />

            <span className="ml-2 text-xl font-semibold text-lavender-900">Fingerprint OSS</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <NavLink href="#guide">Guide</NavLink>
            <NavLink href="#docs">Docs</NavLink>
            <NavLink href="https://github.com/IntegerAlex/fingerprint-oss" target="_blank">
              GitHub
            </NavLink>
          </div>
          <div className="md:hidden">
            <button className="text-lavender-900 hover:text-lavender-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, target }: { href: string; children: React.ReactNode; target?: string }) {
  return (
    <Link
      href={href}
      target={target}
      className="text-lavender-700 hover:text-lavender-900 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
  )
}
