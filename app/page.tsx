"use client"

import { useState, useEffect } from "react"
import { userInfo } from "fingerprint-oss"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FingerprintDisplay from "@/components/fingerprint-display"
import InstallationGuide from "@/components/installation-guide"

export default function Home() {
  const [fingerprintData, setFingerprintData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visitCount, setVisitCount] = useState(1)

  useEffect(() => {
    const fetchFingerprintData = async () => {
      try {
        setLoading(true)
        // Try to get the real fingerprint data
        const data = await userInfo({transparency: true, message:"Data is being collected for demo purposes."})
    //    console.log("Fingerprint data:", data)

        // Track visit count using localStorage
        if (typeof window !== "undefined" && data.hash) {
          const storedHash = localStorage.getItem("fingerprint_visitor_hash")
          const storedCount = Number.parseInt(localStorage.getItem("fingerprint_visit_count") || "0")

          if (storedHash === data.hash) {
            // Same visitor, increment count
            const newCount = storedCount + 1
            localStorage.setItem("fingerprint_visit_count", newCount.toString())
            setVisitCount(newCount)
          } else {
            // New visitor or changed fingerprint
            localStorage.setItem("fingerprint_visitor_hash", data.hash)
            localStorage.setItem("fingerprint_visit_count", "1")
            setVisitCount(1)
          }
        }

        // Add VPN status if not present in the data
        if (!data.geolocation.vpnStatus) {
          data.geolocation.vpnStatus = {
            status: data.geolocation.traits?.isAnonymousVpn || false,
            probability: data.geolocation.traits?.isAnonymousVpn ? 0.85 : 0.15,
          }
        }

        setFingerprintData(data)
      } catch (err) {
        console.error("Error fetching fingerprint data:", err)

        // Provide demo data based on the actual structure
        const demoData = {
          confidenceAssessment: {
            system: {
              score: 0.75,
              rating: "Medium-High Confidence",
              description: "The data appears mostly consistent with some minor discrepancies.",
              reliability: "Data is generally reliable but may have some inconsistencies worth investigating.",
              level: "medium-high",
              factors: "No bot signals detected",
            },
            combined: {
              score: 0.6,
              rating: "Medium Confidence",
              description: "The data shows a moderate level of consistency, but with some concerning signals.",
              reliability: "Data should be treated with caution and verified through additional means.",
              level: "medium",
              factors: "No suspicious network factors detected",
            },
          },
          geolocation: {
            ip: "192.168.1.1",
            city: "New York",
            region: {
              isoCode: "NY",
              name: "New York",
            },
            country: {
              isoCode: "US",
              name: "United States",
            },
            continent: {
              code: "NA",
              name: "North America",
            },
            location: {
              accuracyRadius: 100,
              latitude: 40.7128,
              longitude: -74.006,
              timeZone: "America/New_York",
            },
            traits: {
              isAnonymous: false,
              isAnonymousProxy: false,
              isAnonymousVpn: false,
              network: "192.168.1.0/24",
            },
            vpnStatus: {
              status: false,
              probability: 0.15,
            },
          },
          systemInfo: {
            incognito: {
              isPrivate: false,
              browserName: navigator.userAgent.includes("Chrome") ? "Chrome" : "Firefox",
            },
            adBlocker: {
              isBrave: false,
              adBlocker: false,
            },
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            languages: navigator.languages || ["en-US"],
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: null,
            screenResolution: [window.screen.width, window.screen.height],
            colorDepth: window.screen.colorDepth,
            colorGamut: "srgb",
            touchSupport: {
              maxTouchPoints: navigator.maxTouchPoints || 0,
              touchEvent: "ontouchstart" in window,
              touchStart: false,
            },
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            deviceMemory: 8,
            os: {
              os: /Windows/.test(navigator.userAgent) ? "Windows" : /Mac/.test(navigator.userAgent) ? "MacOS" : "Linux",
              version: "10",
            },
            localStorage: typeof localStorage !== "undefined",
            sessionStorage: typeof sessionStorage !== "undefined",
            indexedDB: typeof indexedDB !== "undefined",
            webGL: {
              vendor: "Demo Vendor",
              renderer: "Demo Renderer",
            },
            canvas: {
              winding: false,
              geometry: "data:image/png;base64,demo",
              text: "14px Arial",
            },
            plugins: [
              {
                name: "PDF Viewer",
                description: "Portable Document Format",
                mimeTypes: [{ type: "application/pdf", suffixes: "pdf" }],
              },
            ],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            vendor: "Google Inc.",
            vendorFlavors: ["chrome"],
            confidenceScore: 0.75,
            bot: {
              isBot: false,
              signals: [],
              confidence: 0.5,
            },
          },
          hash: "demo" + Math.random().toString(36).substring(2, 15),
        }

        // Set up localStorage for demo data
        if (typeof window !== "undefined") {
          const storedHash = localStorage.getItem("fingerprint_visitor_hash")
          const storedCount = Number.parseInt(localStorage.getItem("fingerprint_visit_count") || "0")

          if (storedHash && storedHash.startsWith("demo")) {
            // We've seen this demo user before
            const newCount = storedCount + 1
            localStorage.setItem("fingerprint_visit_count", newCount.toString())
            setVisitCount(newCount)
          } else {
            // First time demo user
            localStorage.setItem("fingerprint_visitor_hash", demoData.hash)
            localStorage.setItem("fingerprint_visit_count", "1")
            setVisitCount(1)
          }
        }

        setFingerprintData(demoData)
        setError("Using demo data. The fingerprint-oss package couldn't be initialized.")
      } finally {
        setLoading(false)
      }
    }

    fetchFingerprintData()
  }, [])

  return (
    <div className="min-h-screen bg-lavender-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-lavender-900 mb-4">Fingerprint OSS Demo</h1>
            <p className="text-lg text-lavender-700 max-w-2xl mx-auto">
              See how the fingerprint-oss package can identify unique visitors to your website with high accuracy.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-lavender-600" />
              <span className="ml-3 text-lavender-700 text-lg">Generating your fingerprint...</span>
            </div>
          ) : error ? (
            <div>
              <div
                className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Note: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <FingerprintDisplay data={fingerprintData} visitCount={visitCount} />
            </div>
          ) : (
            <FingerprintDisplay data={fingerprintData} visitCount={visitCount} />
          )}
        </section>

        <InstallationGuide />
      </main>
      <Footer />
    </div>
  )
}
