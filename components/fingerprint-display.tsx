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

const InfoCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <div className="bg-secondary p-3 rounded-lg">
    <div className="flex items-center text-muted-foreground mb-1">
      <Icon className="h-4 w-4 mr-2" />
      <p className="text-sm">{title}</p>
    </div>
    <p className="font-medium text-foreground text-sm break-all">{value}</p>
  </div>
)

export default function FingerprintDisplay({ data, visitCount }: FingerprintDisplayProps) {
  if (!data) return null

  const isDemo = !data.hash || data.hash.startsWith("demo")

  const { confidenceAssessment, geolocation, systemInfo, hash } = data

  const systemConfidence = confidenceAssessment?.system?.score || 0
  const combinedConfidence = confidenceAssessment?.combined?.score || 0
  const systemConfidencePercentage = `${Math.round(systemConfidence * 100)}%`
  const combinedConfidencePercentage = `${Math.round(combinedConfidence * 100)}%`

  const systemRating = confidenceAssessment?.system?.rating || "Unknown"
  const combinedRating = confidenceAssessment?.combined?.rating || "Unknown"

  const browserName = systemInfo?.incognito?.browserName || "Unknown"
  const os = systemInfo?.os?.os || "Unknown"
  const osVersion = systemInfo?.os?.version || "Unknown"

  const isMobile = systemInfo?.touchSupport?.maxTouchPoints > 0
  const deviceType = isMobile ? "Mobile" : "Desktop"

  const country = geolocation?.country?.name || "Unknown"
  const city = geolocation?.city || "Unknown"
  const ip = geolocation?.ip || "Unknown"

  const vpnStatus = geolocation?.vpnStatus?.status || false
  const vpnProbability = geolocation?.vpnStatus?.probability || 0
  const vpnProbabilityPercentage = `${Math.round(vpnProbability * 100)}%`

  return (
    <>
      {isDemo && (
        <div
          className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-lg relative mb-6"
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
          <TabsTrigger value="location">Geolocation</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Fingerprint className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">Visitor Identification</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Visitor ID (Hash)</p>
                  <p className="font-mono bg-secondary p-2 rounded text-sm break-all">{hash}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">System Confidence</p>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-primary mr-2" />
                    <Badge variant="outline" className="font-medium">
                      {systemConfidencePercentage} - {systemRating}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Visit Count</p>
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-primary mr-2" />
                    <Badge variant="outline" className="font-medium">
                      {visitCount} {visitCount === 1 ? "visit" : "visits"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">Device Information</h2>
              </div>
              <div className="space-y-4">
                <InfoCard title="Device Type" value={deviceType} icon={Monitor} />
                <InfoCard title="Browser" value={browserName} icon={Globe} />
                <InfoCard title="Operating System" value={`${os} ${osVersion}`} icon={Cpu} />
              </div>
            </Card>

            <Card className="p-6 md:col-span-2">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">Location Summary</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard title="IP Address" value={ip} icon={Info} />
                <InfoCard title="Country" value={country} icon={Globe} />
                <InfoCard title="City" value={city || "Not Available"} icon={MapPin} />
              </div>

              <Card className="mt-4 bg-secondary p-4">
                <div className="flex items-center mb-2">
                  {vpnStatus ? (
                    <EyeOff className="h-5 w-5 text-destructive mr-2" />
                  ) : (
                    <Eye className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  <p className="font-medium text-foreground">VPN Status: {vpnStatus ? "Detected" : "Not Detected"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VPN Probability</span>
                    <span className={vpnProbability > 0.5 ? "text-destructive font-medium" : "text-green-400 font-medium"}>
                      {vpnProbabilityPercentage}
                    </span>
                  </div>
                  <Progress
                    value={vpnProbability * 100}
                    className="h-2"
                    indicatorClassName={vpnProbability > 0.5 ? "bg-destructive" : "bg-green-500"}
                  />
                </div>
              </Card>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Monitor className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Browser & Hardware</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard title="User Agent" value={systemInfo?.userAgent || "Unknown"} icon={Info} />
              <InfoCard title="Platform" value={systemInfo?.platform || "Unknown"} icon={Layers} />
              <InfoCard title="Screen Resolution" value={systemInfo?.screenResolution ? systemInfo.screenResolution.join(" × ") : "Unknown"} icon={Monitor} />
              <InfoCard title="Color Depth" value={`${systemInfo?.colorDepth || "Unknown"} bit`} icon={Layers} />
              <InfoCard title="CPU Cores" value={systemInfo?.hardwareConcurrency || "Unknown"} icon={Cpu} />
              <InfoCard title="Device Memory" value={`${systemInfo?.deviceMemory || "Unknown"} GB`} icon={Cpu} />
              <InfoCard title="Timezone" value={systemInfo?.timezone || "Unknown"} icon={Globe} />
              <InfoCard title="Language" value={systemInfo?.languages ? systemInfo.languages[0] : "Unknown"} icon={Globe} />
              <InfoCard title="Touch Support" value={systemInfo?.touchSupport?.maxTouchPoints > 0 ? "Yes" : "No"} icon={Fingerprint} />
              <InfoCard title="Cookies Enabled" value={systemInfo?.cookiesEnabled ? "Yes" : "No"} icon={Check} />
              <InfoCard title="Incognito" value={systemInfo?.incognito?.isPrivate ? "Yes" : "No"} icon={systemInfo?.incognito?.isPrivate ? EyeOff : Eye} />
              <InfoCard title="Ad Blocker" value={systemInfo?.adBlocker?.adBlocker ? "Yes" : "No"} icon={Shield} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-foreground">Geolocation Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard title="IP Address" value={geolocation?.ip || "Unknown"} icon={Info} />
              <InfoCard title="Country" value={`${geolocation?.country?.name || "Unknown"} (${geolocation?.country?.isoCode || "N/A"})`} icon={Globe} />
              <InfoCard title="Region" value={`${geolocation?.region?.name || "Unknown"} (${geolocation?.region?.isoCode || "N/A"})`} icon={MapPin} />
              <InfoCard title="City" value={geolocation?.city || "Unknown"} icon={MapPin} />
              <InfoCard title="Continent" value={`${geolocation?.continent?.name || "Unknown"} (${geolocation?.continent?.code || "N/A"})`} icon={Globe} />
              <InfoCard title="Latitude" value={geolocation?.location?.latitude || "Unknown"} icon={MapPin} />
              <InfoCard title="Longitude" value={geolocation?.location?.longitude || "Unknown"} icon={MapPin} />
              <InfoCard title="Timezone" value={geolocation?.location?.timeZone || "Unknown"} icon={Globe} />
              <InfoCard title="Network" value={geolocation?.traits?.network || "Unknown"} icon={Layers} />
              <InfoCard title="Anonymous" value={geolocation?.traits?.isAnonymous ? "Yes" : "No"} icon={Shield} />
              <InfoCard title="Anonymous VPN" value={geolocation?.traits?.isAnonymousVpn ? "Yes" : "No"} icon={EyeOff} />
              <InfoCard title="Anonymous Proxy" value={geolocation?.traits?.isAnonymousProxy ? "Yes" : "No"} icon={EyeOff} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="confidence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Gauge className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">System Confidence</h2>
              </div>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-primary">{systemConfidencePercentage}</p>
                <p className="text-lg text-muted-foreground">{systemRating}</p>
              </div>
              <Progress value={systemConfidence * 100} className="h-3" />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{confidenceAssessment?.system?.description}</p>
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Reliability:</strong> {confidenceAssessment?.system?.reliability}</p>
                </div>
                <div className="flex items-start">
                  <Layers className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Factors:</strong> {confidenceAssessment?.system?.factors}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Gauge className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">Combined Confidence</h2>
              </div>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-primary">{combinedConfidencePercentage}</p>
                <p className="text-lg text-muted-foreground">{combinedRating}</p>
              </div>
              <Progress value={combinedConfidence * 100} className="h-3" />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{confidenceAssessment?.combined?.description}</p>
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Reliability:</strong> {confidenceAssessment?.combined?.reliability}</p>
                </div>
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Factors:</strong> {confidenceAssessment?.combined?.factors}</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
