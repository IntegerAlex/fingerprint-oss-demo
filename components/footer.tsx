import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="footer bg-black text-white py-6">
      <div className="footer-container container mx-auto px-4 flex justify-between items-center">
        {/* Left: Logos */}
        <div className="footer-left flex items-center">
          <img src="./logo.png" alt="Fingerprint Logo" className="footer-logo h-12" />
          <img src="./goss.png" alt="GOSS Logo" className="footer-logo h-24 ml-4" />
        </div>

        {/* Right: Info & Links */}
        <div className="footer-right text-right">
          <p className="footer-copy text-gray-400">&copy; 2025 globalopensourcesoftwares. All rights reserved.</p>
          <div className="footer-links mt-2">
            <Link href="https://github.com/globalopensourcesoftwares" target="_blank" className="text-gray-400 hover:text-white transition">
              GitHub Profile
            </Link>
            <span className="mx-2 text-gray-500">|</span>
            <Link href="https://gossorg.in" target="_blank" className="text-gray-400 hover:text-white transition">
              Enterprise Solution
            </Link>
          </div>
          <p className="footer-collab-text text-gray-400 mt-2">A product of <strong>Global Open Source Softwares (GOSS)</strong></p>
        </div>
      </div>
    </footer>
  )
}

