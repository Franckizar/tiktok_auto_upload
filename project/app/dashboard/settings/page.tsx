'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences and TikTok integration.
        </p>
      </div>

      <div className="grid gap-6">
        {/* TikTok Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>TikTok Integration</span>
              </CardTitle>
              <CardDescription>
                Connect your TikTok account to enable automatic posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">TikTok Account</p>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
                <Button className="tiktok-gradient text-white">
                  Connect TikTok
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posting Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Posting Preferences</span>
              </CardTitle>
              <CardDescription>
                Set your default preferences for new posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-music">Auto-add music</Label>
                  <p className="text-sm text-gray-500">
                    Automatically add trending music to posts
                  </p>
                </div>
                <Switch id="auto-music" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="private-default">Private by default</Label>
                  <p className="text-sm text-gray-500">
                    Make new posts private by default
                  </p>
                </div>
                <Switch id="private-default" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive email updates about your posts
                  </p>
                </div>
                <Switch id="email-notifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="post-success">Post success notifications</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when posts are published successfully
                  </p>
                </div>
                <Switch id="post-success" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="post-failure">Post failure notifications</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when posts fail to publish
                  </p>
                </div>
                <Switch id="post-failure" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account information and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}