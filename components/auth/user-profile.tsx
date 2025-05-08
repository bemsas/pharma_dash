"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { updateUserProfile, changePassword } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"

export function UserProfile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setIsUpdating(true)

    try {
      const result = await updateUserProfile({ name })

      if (result.success) {
        setProfileSuccess("Profile updated successfully")
      } else {
        setProfileError(result.message)
      }
    } catch (error) {
      setProfileError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    setIsChangingPassword(true)

    try {
      const result = await changePassword(currentPassword, newPassword)

      if (result.success) {
        setPasswordSuccess("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordError(result.message)
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!user) {
    return <div>Please log in to view your profile</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {profileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}

            {profileSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>{profileSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={user.username} disabled />
              <p className="text-xs text-gray-500">Username cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
