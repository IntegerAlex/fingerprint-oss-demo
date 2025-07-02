"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Copy,
  ChevronDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface FingerprintDisplayProps {
  data: any;
  visitCount: number;
}

const InfoCard = ({
  title,
  value,
  icon: Icon,
  className = "",
  copyable = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyable) {
      navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`bg-secondary/50 hover:bg-secondary transition-all duration-300 p-4 rounded-lg border border-border/50 hover:border-primary/20 group ${className}`}
    >
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2 text-primary" />
          <p className="text-sm font-medium">{title}</p>
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-background rounded"
          >
            <Copy className="h-3 w-3" />
          </button>
        )}
      </div>
      <p className="font-medium text-foreground text-sm break-all leading-relaxed">
        {value}
      </p>
      {copied && <p className="text-xs text-green-400 mt-1">Copied!</p>}
    </div>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center mb-2">
      <Icon className="h-6 w-6 text-primary mr-3" />
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    {description && (
      <p className="text-muted-foreground text-sm ml-9">{description}</p>
    )}
  </div>
);

export default function FingerprintDisplay({
  data,
  visitCount,
}: FingerprintDisplayProps) {
  if (!data) return null;

  const isDemo = !data.hash || data.hash.startsWith("demo");
  const { confidenceAssessment, geolocation, systemInfo, hash } = data;

  const systemConfidence = confidenceAssessment?.system?.score || 0;
  const combinedConfidence = confidenceAssessment?.combined?.score || 0;
  const systemConfidencePercentage = `${Math.round(systemConfidence * 100)}%`;
  const combinedConfidencePercentage = `${Math.round(combinedConfidence * 100)}%`;

  const systemRating = confidenceAssessment?.system?.rating || "Unknown";
  const combinedRating = confidenceAssessment?.combined?.rating || "Unknown";

  const browserName = systemInfo?.incognito?.browserName || "Unknown";
  const os = systemInfo?.os?.os || "Unknown";
  const osVersion = systemInfo?.os?.version || "Unknown";

  const isMobile = systemInfo?.touchSupport?.maxTouchPoints > 0;
  const deviceType = isMobile ? "Mobile" : "Desktop";

  const country = geolocation?.country?.name || "Unknown";
  const city = geolocation?.city || "Unknown";
  const ip = geolocation?.ip || "Unknown";

  const vpnStatus = geolocation?.vpnStatus?.status || false;
  const vpnProbability = geolocation?.vpnStatus?.probability || 0;
  const vpnProbabilityPercentage = `${Math.round(vpnProbability * 100)}%`;

  return (
    <div className="w-full space-y-12">
      {isDemo && (
        <div
          className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-6 py-4 rounded-lg relative animate-in fade-in duration-500"
          role="alert"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <strong className="font-bold">Demo Mode: </strong>
              <span className="block sm:inline">
                This is a demonstration with simulated data. The fingerprint-oss
                package may require additional configuration in your production
                environment.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overview Section */}
      <section className="animate-in slide-in-from-bottom-4 duration-700">
        <SectionHeader
          icon={Fingerprint}
          title="Visitor Overview"
          description="Essential information about this unique visitor session"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Fingerprint className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Visitor Identity
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Unique Visitor Hash
                </p>
                <div className="font-mono bg-secondary/50 p-3 rounded text-sm break-all relative group">
                  {hash}
                  <button
                    onClick={() => navigator.clipboard.writeText(hash)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-background rounded"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Visit Count
                </span>
                <Badge variant="outline" className="font-medium">
                  <History className="h-3 w-3 mr-1" />
                  {visitCount} {visitCount === 1 ? "visit" : "visits"}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Monitor className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Device Summary
              </h3>
            </div>
            <div className="space-y-3">
              <InfoCard title="Device Type" value={deviceType} icon={Monitor} />
              <InfoCard title="Browser" value={browserName} icon={Globe} />
              <InfoCard
                title="Operating System"
                value={`${os} ${osVersion}`}
                icon={Cpu}
              />
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300 md:col-span-2 xl:col-span-1">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Location
              </h3>
            </div>
            <div className="space-y-3">
              <InfoCard title="IP Address" value={ip} icon={Info} copyable />
              <InfoCard title="Country" value={country} icon={Globe} />
              <InfoCard
                title="City"
                value={city || "Not Available"}
                icon={MapPin}
              />
            </div>
          </Card>
        </div>

        {/* VPN Status Card */}
        <Card className="mt-6 p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-foreground">
              Security Analysis
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                {vpnStatus ? (
                  <EyeOff className="h-5 w-5 text-destructive mr-2" />
                ) : (
                  <Eye className="h-5 w-5 text-green-500 mr-2" />
                )}
                <p className="font-medium text-foreground">
                  VPN Status: {vpnStatus ? "Detected" : "Not Detected"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VPN Probability</span>
                  <span
                    className={
                      vpnProbability > 0.5
                        ? "text-destructive font-medium"
                        : "text-green-400 font-medium"
                    }
                  >
                    {vpnProbabilityPercentage}
                  </span>
                </div>
                <Progress
                  value={vpnProbability * 100}
                  className="h-3"
                  indicatorClassName={
                    vpnProbability > 0.5 ? "bg-destructive" : "bg-green-500"
                  }
                />
              </div>
            </div>
            <div className="space-y-3">
              <InfoCard
                title="Anonymous"
                value={geolocation?.traits?.isAnonymous ? "Yes" : "No"}
                icon={Shield}
              />
              <InfoCard
                title="Proxy Detection"
                value={
                  geolocation?.traits?.isAnonymousProxy
                    ? "Detected"
                    : "Not Detected"
                }
                icon={EyeOff}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* System Information Section */}
      <section className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
        <SectionHeader
          icon={Monitor}
          title="System Information"
          description="Detailed browser and hardware specifications"
        />

        <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <InfoCard
              title="User Agent"
              value={systemInfo?.userAgent || "Unknown"}
              icon={Info}
              copyable
            />
            <InfoCard
              title="Platform"
              value={systemInfo?.platform || "Unknown"}
              icon={Layers}
            />
            <InfoCard
              title="Screen Resolution"
              value={
                systemInfo?.screenResolution
                  ? systemInfo.screenResolution.join(" × ")
                  : "Unknown"
              }
              icon={Monitor}
            />
            <InfoCard
              title="Color Depth"
              value={`${systemInfo?.colorDepth || "Unknown"} bit`}
              icon={Layers}
            />
            <InfoCard
              title="CPU Cores"
              value={systemInfo?.hardwareConcurrency || "Unknown"}
              icon={Cpu}
            />
            <InfoCard
              title="Device Memory"
              value={`${systemInfo?.deviceMemory || "Unknown"} GB`}
              icon={Cpu}
            />
            <InfoCard
              title="Timezone"
              value={systemInfo?.timezone || "Unknown"}
              icon={Globe}
            />
            <InfoCard
              title="Language"
              value={
                systemInfo?.languages ? systemInfo.languages[0] : "Unknown"
              }
              icon={Globe}
            />
            <InfoCard
              title="Touch Support"
              value={
                systemInfo?.touchSupport?.maxTouchPoints > 0 ? "Yes" : "No"
              }
              icon={Fingerprint}
            />
            <InfoCard
              title="Cookies Enabled"
              value={systemInfo?.cookiesEnabled ? "Yes" : "No"}
              icon={Check}
            />
            <InfoCard
              title="Incognito Mode"
              value={systemInfo?.incognito?.isPrivate ? "Yes" : "No"}
              icon={systemInfo?.incognito?.isPrivate ? EyeOff : Eye}
            />
            <InfoCard
              title="Ad Blocker"
              value={
                systemInfo?.adBlocker?.adBlocker ? "Detected" : "Not Detected"
              }
              icon={Shield}
            />
          </div>
        </Card>
      </section>

      {/* Geolocation Section */}
      <section className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <SectionHeader
          icon={MapPin}
          title="Geolocation Details"
          description="Comprehensive location and network information"
        />

        <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <InfoCard
              title="IP Address"
              value={geolocation?.ip || "Unknown"}
              icon={Info}
              copyable
            />
            <InfoCard
              title="Country"
              value={`${geolocation?.country?.name || "Unknown"} (${geolocation?.country?.isoCode || "N/A"})`}
              icon={Globe}
            />
            <InfoCard
              title="Region"
              value={`${geolocation?.region?.name || "Unknown"} (${geolocation?.region?.isoCode || "N/A"})`}
              icon={MapPin}
            />
            <InfoCard
              title="City"
              value={geolocation?.city || "Unknown"}
              icon={MapPin}
            />
            <InfoCard
              title="Continent"
              value={`${geolocation?.continent?.name || "Unknown"} (${geolocation?.continent?.code || "N/A"})`}
              icon={Globe}
            />
            <InfoCard
              title="Latitude"
              value={geolocation?.location?.latitude || "Unknown"}
              icon={MapPin}
            />
            <InfoCard
              title="Longitude"
              value={geolocation?.location?.longitude || "Unknown"}
              icon={MapPin}
            />
            <InfoCard
              title="Timezone"
              value={geolocation?.location?.timeZone || "Unknown"}
              icon={Globe}
            />
            <InfoCard
              title="Network"
              value={geolocation?.traits?.network || "Unknown"}
              icon={Layers}
              copyable
            />
            <InfoCard
              title="Anonymous"
              value={geolocation?.traits?.isAnonymous ? "Yes" : "No"}
              icon={Shield}
            />
            <InfoCard
              title="Anonymous VPN"
              value={geolocation?.traits?.isAnonymousVpn ? "Yes" : "No"}
              icon={EyeOff}
            />
            <InfoCard
              title="Anonymous Proxy"
              value={geolocation?.traits?.isAnonymousProxy ? "Yes" : "No"}
              icon={EyeOff}
            />
          </div>
        </Card>
      </section>

      {/* Confidence Assessment Section */}
      <section className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
        <SectionHeader
          icon={Gauge}
          title="Confidence Assessment"
          description="Statistical analysis of fingerprint reliability and accuracy"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center mb-6">
              <Gauge className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">
                System Confidence
              </h3>
            </div>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="text-6xl font-bold text-primary mb-2">
                  {systemConfidencePercentage}
                </div>
                <div className="text-lg text-muted-foreground">
                  {systemRating}
                </div>
              </div>
            </div>
            <Progress value={systemConfidence * 100} className="h-4 mb-6" />
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {confidenceAssessment?.system?.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Reliability
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {confidenceAssessment?.system?.reliability}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Layers className="h-4 w-4 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Factors
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {confidenceAssessment?.system?.factors}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center mb-6">
              <Gauge className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">
                Combined Confidence
              </h3>
            </div>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="text-6xl font-bold text-primary mb-2">
                  {combinedConfidencePercentage}
                </div>
                <div className="text-lg text-muted-foreground">
                  {combinedRating}
                </div>
              </div>
            </div>
            <Progress value={combinedConfidence * 100} className="h-4 mb-6" />
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {confidenceAssessment?.combined?.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Reliability
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {confidenceAssessment?.combined?.reliability}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Factors
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {confidenceAssessment?.combined?.factors}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
