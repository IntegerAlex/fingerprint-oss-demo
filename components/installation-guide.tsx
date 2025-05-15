"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InstallationGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <section id="guide" className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-lavender-900 mb-4">Installation Guide</h2>
        <p className="text-lg text-lavender-700 max-w-2xl mx-auto">
          Get started with Fingerprint OSS in just a few steps
        </p>
      </div>

      <Card className="p-6 bg-white border-lavender-200 shadow-md">
        <Tabs defaultValue="npm">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          </TabsList>

          {/* NPM Tab */}
          <TabsContent value="npm">
            <div className="bg-lavender-900 text-white p-4 rounded-md relative">
              <pre className="font-mono text-sm overflow-x-auto">
                <code>npm install fingerprint-oss@latest</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-lavender-300 hover:text-white hover:bg-lavender-800"
                onClick={() => copyToClipboard("npm install fingerprint-oss@latest")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* PNPM Tab */}
          <TabsContent value="pnpm">
            <div className="bg-lavender-900 text-white p-4 rounded-md relative">
              <pre className="font-mono text-sm overflow-x-auto">
                <code>pnpm install fingerprint-oss@latest</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-lavender-300 hover:text-white hover:bg-lavender-800"
                onClick={() => copyToClipboard("pnpm install fingerprint-oss@latest")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-lavender-900 mb-4">Usage Example</h3>
          <div className="bg-lavender-900 text-white p-4 rounded-md relative">
            <pre className="font-mono text-sm overflow-x-auto">
              <code>{`const  userInfo  = require('fingerprint-oss');

const data = await userInfo();
console.log(data); // Contains visitor ID, device info, and more`}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-lavender-300 hover:text-white hover:bg-lavender-800"
              onClick={() =>
                copyToClipboard(`const  userInfo  = require('fingerprint-oss');

const fetchFingerprintData = async () => {
  const data = await userInfo();
  console.log(data); // Contains visitor ID, device info, and more
  return data;
}`)
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

