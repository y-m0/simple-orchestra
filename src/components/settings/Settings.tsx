import React from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  const handleValueChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleValueChange('theme', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggle('notifications')}
              />
            </div>
          </div>

          {/* Auto Save Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Workflow Editor</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoSave">Auto Save</Label>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={() => handleToggle('autoSave')}
              />
            </div>
          </div>

          {/* Dashboard Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dashboard</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
              <Input
                id="refreshInterval"
                type="number"
                value={settings.dashboardRefreshInterval}
                onChange={(e) =>
                  handleValueChange('dashboardRefreshInterval', parseInt(e.target.value))
                }
                className="w-[180px]"
                min={5}
                max={300}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 