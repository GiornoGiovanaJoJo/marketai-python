import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Employees() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Employees</h1>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Employee list will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
