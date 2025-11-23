import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Automation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Automation</h1>
        <Card>
          <CardHeader>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>Automated campaign management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Automation rules will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
