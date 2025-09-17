'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface RestaurantSettingsFormProps {
  restaurantId: string
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

const SLOT_INTERVALS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '60 minutes' },
]

export function RestaurantSettingsForm({
  restaurantId, // eslint-disable-line @typescript-eslint/no-unused-vars -- Will be used in task 025 for form validation and save
}: RestaurantSettingsFormProps) {
  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input
                id="restaurant-name"
                placeholder="Enter restaurant name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-slug">URL Slug</Label>
              <Input
                id="restaurant-slug"
                placeholder="restaurant-slug"
                className="w-full"
              />
              <p className="text-sm text-text-secondary">
                This will be used in your booking URL:
                yoursite.com/restaurant-slug
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="contact@restaurant.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Opening Hours Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Opening Hours
            </h2>
            <p className="text-text-secondary">
              Set your restaurant&apos;s operating hours for each day of the
              week.
            </p>
          </div>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.key}
                className="flex items-center gap-4 p-4 border border-border rounded-lg"
              >
                <div className="w-24">
                  <Label className="font-medium">{day.label}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${day.key}-closed`}
                    className="rounded border-border"
                  />
                  <Label htmlFor={`${day.key}-closed`} className="text-sm">
                    Closed
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.key}-open`} className="text-sm">
                    Open:
                  </Label>
                  <Input
                    id={`${day.key}-open`}
                    type="time"
                    className="w-32"
                    defaultValue="09:00"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.key}-close`} className="text-sm">
                    Close:
                  </Label>
                  <Input
                    id={`${day.key}-close`}
                    type="time"
                    className="w-32"
                    defaultValue="22:00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reservation Constraints Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Reservation Settings
            </h2>
            <p className="text-text-secondary">
              Configure reservation constraints and booking rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min-guests">Minimum Guests</Label>
              <Input
                id="min-guests"
                type="number"
                min="1"
                defaultValue="1"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-guests">Maximum Guests</Label>
              <Input
                id="max-guests"
                type="number"
                min="1"
                defaultValue="8"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-reservations-per-slot">
                Max Reservations per Slot
              </Label>
              <Input
                id="max-reservations-per-slot"
                type="number"
                min="1"
                defaultValue="5"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="slot-interval">Time Slot Interval</Label>
              <Select>
                <option value="">Select interval</option>
                {SLOT_INTERVALS.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-time-min">Minimum Lead Time (hours)</Label>
              <Input
                id="lead-time-min"
                type="number"
                min="0"
                defaultValue="2"
                className="w-full"
              />
              <p className="text-xs text-text-secondary">
                How far in advance customers must book
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-time-max">Maximum Lead Time (days)</Label>
              <Input
                id="lead-time-max"
                type="number"
                min="1"
                defaultValue="30"
                className="w-full"
              />
              <p className="text-xs text-text-secondary">
                How far in advance customers can book
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
