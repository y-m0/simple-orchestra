
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how and when you receive alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="approval-email">Approval Requests</Label>
              <p className="text-sm text-muted-foreground">Get notified when an agent requires approval</p>
            </div>
            <Switch id="approval-email" checked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="error-email">Agent Errors</Label>
              <p className="text-sm text-muted-foreground">Get notified when an agent encounters an error</p>
            </div>
            <Switch id="error-email" checked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="completion-email">Task Completions</Label>
              <p className="text-sm text-muted-foreground">Get notified when a task completes</p>
            </div>
            <Switch id="completion-email" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="digest-email">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Get a daily summary of all agent activities</p>
            </div>
            <Switch id="digest-email" checked />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">In-App Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="in-app-all">Show All Notifications</Label>
              <p className="text-sm text-muted-foreground">Display all notifications in the app</p>
            </div>
            <Switch id="in-app-all" checked />
          </div>
          
          <div>
            <Label htmlFor="priority-level">Minimum Priority Level</Label>
            <p className="text-sm text-muted-foreground mb-2">Only show notifications above selected priority</p>
            <Select defaultValue="low">
              <SelectTrigger id="priority-level">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notification-sound">Notification Sound Volume</Label>
            <Slider id="notification-sound" defaultValue={[70]} max={100} step={1} className="mt-2" />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mobile Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-critical">Critical Alerts Only</Label>
              <p className="text-sm text-muted-foreground">Only send push notifications for critical issues</p>
            </div>
            <Switch id="push-critical" checked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Silence notifications during specified hours</p>
            </div>
            <Switch id="quiet-hours" checked />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-start">Quiet Hours Start</Label>
              <Select defaultValue="22">
                <SelectTrigger id="quiet-start">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quiet-end">Quiet Hours End</Label>
              <Select defaultValue="7">
                <SelectTrigger id="quiet-end">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
