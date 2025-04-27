import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Fingerprint,
  Globe,
  Monitor,
  Cpu,
  Shield,
  MapPin,
  Gauge,
  Info,
  Layers,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  History,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FingerprintDisplayProps {
  data: any
  visitCount: number
}

export default function FingerprintDisplay({ data, visitCount }: FingerprintDisplayProps) {
  if (!data) return null

  const isDemo = !data.hash || data.hash.startsWith("demo")

  // Extract main sections
  const { confidenceAssessment, geolocation, systemInfo, hash } = data

  // Format confidence scores
  const systemConfidence = confidenceAssessment?.system?.score || 0
  const combinedConfidence = confidenceAssessment?.combined?.score || 0
  const systemConfidencePercentage = `${Math.round(systemConfidence * 100)}%`
  const combinedConfidencePercentage = `${Math.round(combinedConfidence * 100)}%`

  // Get confidence rating
  const systemRating = confidenceAssessment?.system?.rating || "Unknown"
  const combinedRating = confidenceAssessment?.combined?.rating || "Unknown"

  // Get browser and OS info
  const browserName = systemInfo?.incognito?.browserName || "Unknown"
  const os = systemInfo?.os?.os || "Unknown"
  const osVersion = systemInfo?.os?.version || "Unknown"

  // Get device info
  const isMobile = systemInfo?.touchSupport?.maxTouchPoints > 0
  const deviceType = isMobile ? "Mobile" : "Desktop"

  // Get location info
  const country = geolocation?.country?.name || "Unknown"
  const city = geolocation?.city || "Unknown"
  const ip = geolocation?.ip || "Unknown"

  // Get VPN status
  const vpnStatus = geolocation?.vpnStatus?.vpn.status || false
  const vpnProbability = geolocation?.vpnStatus?.vpn.probability || 0
  const vpnProbabilityPercentage = `${Math.round(vpnProbability * 100)}%`

  return (
    <>
      {isDemo && (
        <div
          className="bg-lavender-100 border border-lavender-300 text-lavender-800 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Note: </strong>
          <span className="block sm:inline">
            This is a demonstration with simulated data. The fingerprint-oss package may require additional
            configuration in your environment.
          </span>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
          <TabsTrigger value="location">Geolocation</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Fingerprint className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Visitor Identification</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-lavender-500 mb-1">Visitor ID (Hash)</p>
                  <p className="font-mono bg-lavender-50 p-2 rounded text-sm break-all">{hash}</p>
                </div>
                <div>
                  <p className="text-sm text-lavender-500 mb-1">System Confidence</p>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-lavender-600 mr-2" />
                    <Badge variant="outline" className="bg-lavender-100 text-lavender-800 font-medium">
                      {systemConfidencePercentage} - {systemRating}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-lavender-500 mb-1">Visit Count</p>
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-lavender-600 mr-2" />
                    <Badge variant="outline" className="bg-lavender-100 text-lavender-800 font-medium">
                      {visitCount} {visitCount === 1 ? "visit" : "visits"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Device Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-lavender-500 mb-1">Device Type</p>
                  <div className="flex items-center">
                    {deviceType === "Mobile" ? (
                      <Monitor className="h-5 w-5 text-lavender-600 mr-2" />
                    ) : (
                      <Monitor className="h-5 w-5 text-lavender-600 mr-2" />
                    )}
                    <span>{deviceType}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-lavender-500 mb-1">Browser</p>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-lavender-600 mr-2" />
                    <span>{browserName}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-lavender-500 mb-1">Operating System</p>
                  <div className="flex items-center">
                    <Cpu className="h-5 w-5 text-lavender-600 mr-2" />
                    <span>
                      {os} {osVersion}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md md:col-span-2">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Location Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">IP Address</p>
                  <p className="font-medium">{ip}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Country</p>
                  <p className="font-medium">{country}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">City</p>
                  <p className="font-medium">{city || "Not Available"}</p>
                </div>
              </div>

              {/* VPN Status Card */}
              <div className="mt-4 bg-lavender-50 p-4 rounded">
                <div className="flex items-center mb-2">
                  {vpnStatus ? (
                    <EyeOff className="h-5 w-5 text-red-600 mr-2" />
                  ) : (
                    <Eye className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <p className="font-medium">VPN Status: {vpnStatus ? "Detected" : "Not Detected"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>VPN Probability</span>
                    <span className={vpnProbability > 0.5 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                      {vpnProbabilityPercentage}
                    </span>
                  </div>
                  <Progress
                    value={vpnProbability * 100}
                    className="h-2"
                    indicatorClassName={vpnProbability > 0.5 ? "bg-red-500" : "bg-green-500"}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* System Info Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Browser & Hardware</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">User Agent</p>
                  <p className="font-medium text-sm break-all">{systemInfo?.userAgent || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Platform</p>
                  <p className="font-medium">{systemInfo?.platform || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Screen Resolution</p>
                  <p className="font-medium">
                    {systemInfo?.screenResolution ? systemInfo.screenResolution.join(" × ") : "Unknown"}
                  </p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Color Depth</p>
                  <p className="font-medium">{systemInfo?.colorDepth || "Unknown"} bit</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">CPU Cores</p>
                  <p className="font-medium">{systemInfo?.hardwareConcurrency || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Device Memory</p>
                  <p className="font-medium">{systemInfo?.deviceMemory || "Unknown"} GB</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Timezone</p>
                  <p className="font-medium">{systemInfo?.timezone || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Language</p>
                  <p className="font-medium">{systemInfo?.languages ? systemInfo.languages[0] : "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Touch Support</p>
                  <p className="font-medium">{systemInfo?.touchSupport?.maxTouchPoints > 0 ? "Yes" : "No"}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Privacy & Security</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Incognito Mode</p>
                  <div className="flex items-center">
                    {systemInfo?.incognito?.isPrivate ? (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    )}
                    <p className="font-medium">{systemInfo?.incognito?.isPrivate ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Ad Blocker</p>
                  <div className="flex items-center">
                    {systemInfo?.adBlocker?.adBlocker ? (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    )}
                    <p className="font-medium">{systemInfo?.adBlocker?.adBlocker ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Brave Browser</p>
                  <div className="flex items-center">
                    {systemInfo?.adBlocker?.isBrave ? (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    )}
                    <p className="font-medium">{systemInfo?.adBlocker?.isBrave ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Do Not Track</p>
                  <p className="font-medium">
                    {systemInfo?.doNotTrack === null ? "Not Set" : systemInfo.doNotTrack ? "Yes" : "No"}
                  </p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Cookies Enabled</p>
                  <div className="flex items-center">
                    {systemInfo?.cookiesEnabled ? (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    )}
                    <p className="font-medium">{systemInfo?.cookiesEnabled ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Bot Detection</p>
                  <div className="flex items-center">
                    {systemInfo?.bot?.isBot ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-1" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    )}
                    <p className="font-medium">{systemInfo?.bot?.isBot ? "Bot Detected" : "Human"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Visit History Card */}
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <History className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Visit History</h2>
              </div>
              <div className="bg-lavender-50 p-4 rounded">
                <div className="flex items-center mb-2">
                  <History className="h-5 w-5 text-lavender-600 mr-2" />
                  <p className="font-medium">
                    This browser has visited {visitCount} {visitCount === 1 ? "time" : "times"}
                  </p>
                </div>
                <p className="text-sm text-lavender-700">
                  The fingerprint-oss package can reliably identify returning visitors even if they clear cookies or use
                  private browsing. This counter uses localStorage to track visits, but the fingerprint itself doesn't
                  rely on cookies or localStorage.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Geolocation Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">IP Address</p>
                  <p className="font-medium">{geolocation?.ip || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Country</p>
                  <p className="font-medium">{geolocation?.country?.name || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Country Code</p>
                  <p className="font-medium">{geolocation?.country?.isoCode || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Continent</p>
                  <p className="font-medium">{geolocation?.continent?.name || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">City</p>
                  <p className="font-medium">{geolocation?.city || "Not Available"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Region</p>
                  <p className="font-medium">{geolocation?.region?.name || "Not Available"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Timezone</p>
                  <p className="font-medium">{geolocation?.location?.timeZone || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Coordinates</p>
                  <p className="font-medium">
                    {geolocation?.location?.latitude
                      ? `${geolocation.location.latitude}, ${geolocation.location.longitude}`
                      : "Unknown"}
                  </p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Accuracy Radius</p>
                  <p className="font-medium">
                    {geolocation?.location?.accuracyRadius ? `${geolocation.location.accuracyRadius} km` : "Unknown"}
                  </p>
                </div>
              </div>
            </Card>

            {/* VPN Detection Card */}
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">VPN Detection</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-lavender-50 p-4 rounded">
                  <div className="flex items-center mb-3">
                    {vpnStatus ? (
                      <EyeOff className="h-6 w-6 text-red-600 mr-2" />
                    ) : (
                      <Eye className="h-6 w-6 text-green-600 mr-2" />
                    )}
                    <p className="font-medium text-lg">VPN Status: {vpnStatus ? "Detected" : "Not Detected"}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>VPN Probability</span>
                      <span
                        className={vpnProbability > 0.5 ? "text-red-600 font-medium" : "text-green-600 font-medium"}
                      >
                        {vpnProbabilityPercentage}
                      </span>
                    </div>
                    <Progress
                      value={vpnProbability * 100}
                      className="h-3"
                      indicatorClassName={vpnProbability > 0.5 ? "bg-red-500" : "bg-green-500"}
                    />
                    <p className="text-sm text-lavender-700 mt-2">
                      {vpnProbability > 0.8
                        ? "High probability of VPN or proxy usage detected."
                        : vpnProbability > 0.5
                          ? "Moderate probability of VPN or proxy usage detected."
                          : "Low probability of VPN or proxy usage."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Network Traits</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Network</p>
                  <p className="font-medium">{geolocation?.traits?.network || "Unknown"}</p>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Anonymous</p>
                  <div className="flex items-center">
                    {geolocation?.traits?.isAnonymous ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    )}
                    <p className="font-medium">{geolocation?.traits?.isAnonymous ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Anonymous Proxy</p>
                  <div className="flex items-center">
                    {geolocation?.traits?.isAnonymousProxy ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    )}
                    <p className="font-medium">{geolocation?.traits?.isAnonymousProxy ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="bg-lavender-50 p-3 rounded">
                  <p className="text-sm text-lavender-500 mb-1">Anonymous VPN</p>
                  <div className="flex items-center">
                    {geolocation?.traits?.isAnonymousVpn ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-1" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 mr-1" />
                    )}
                    <p className="font-medium">{geolocation?.traits?.isAnonymousVpn ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Confidence Tab */}
        <TabsContent value="confidence">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Gauge className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">System Confidence Assessment</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-lavender-50 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Gauge className="h-5 w-5 text-lavender-600 mr-2" />
                    <p className="font-semibold">Score: {systemConfidencePercentage}</p>
                  </div>
                  <p className="text-sm text-lavender-700 mb-2">Rating: {systemRating}</p>
                  <p className="text-sm text-lavender-700 mb-2">
                    {confidenceAssessment?.system?.description || "No description available"}
                  </p>
                  <p className="text-sm text-lavender-700">
                    <span className="font-medium">Reliability:</span>{" "}
                    {confidenceAssessment?.system?.reliability || "Unknown"}
                  </p>
                  <p className="text-sm text-lavender-700">
                    <span className="font-medium">Factors:</span> {confidenceAssessment?.system?.factors || "None"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Layers className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">Combined Confidence Assessment</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-lavender-50 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Gauge className="h-5 w-5 text-lavender-600 mr-2" />
                    <p className="font-semibold">Score: {combinedConfidencePercentage}</p>
                  </div>
                  <p className="text-sm text-lavender-700 mb-2">Rating: {combinedRating}</p>
                  <p className="text-sm text-lavender-700 mb-2">
                    {confidenceAssessment?.combined?.description || "No description available"}
                  </p>
                  <p className="text-sm text-lavender-700">
                    <span className="font-medium">Reliability:</span>{" "}
                    {confidenceAssessment?.combined?.reliability || "Unknown"}
                  </p>
                  <p className="text-sm text-lavender-700">
                    <span className="font-medium">Factors:</span> {confidenceAssessment?.combined?.factors || "None"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-lavender-200 shadow-md">
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-lavender-600 mr-2" />
                <h2 className="text-xl font-semibold text-lavender-900">What Do These Scores Mean?</h2>
              </div>
              <div className="space-y-4">
                <p className="text-lavender-700">
                  Fingerprint OSS provides confidence scores to indicate how reliable the identification data is:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-lavender-50 p-3 rounded">
                    <p className="font-medium mb-1">System Confidence</p>
                    <p className="text-sm text-lavender-700">
                      Measures how consistent and reliable the system information is, including browser, device, and
                      hardware details.
                    </p>
                  </div>
                  <div className="bg-lavender-50 p-3 rounded">
                    <p className="font-medium mb-1">Combined Confidence</p>
                    <p className="text-sm text-lavender-700">
                      An overall score that combines system information with network and geolocation data for a
                      comprehensive assessment.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="font-medium text-green-800 mb-1">High Confidence (0.8-1.0)</p>
                    <p className="text-sm text-green-700">
                      Data is highly consistent and reliable. Very low probability of spoofing or manipulation.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="font-medium text-yellow-800 mb-1">Medium Confidence (0.5-0.79)</p>
                    <p className="text-sm text-yellow-700">
                      Data shows some inconsistencies but is generally reliable. Some caution advised.
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="font-medium text-red-800 mb-1">Low Confidence (0-0.49)</p>
                    <p className="text-sm text-red-700">
                      Significant inconsistencies detected. High probability of spoofing, VPNs, or privacy tools in use.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
