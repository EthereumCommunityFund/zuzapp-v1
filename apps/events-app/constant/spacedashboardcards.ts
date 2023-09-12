interface SpaceDashboardCard {
  name: string
  description: string
  buttonName: string
}
export const spaceDashboardCards: SpaceDashboardCard[] = [
  {
      name: "Event Visibility",
      description: "Your Event Is Not Published. Only visible to you and editors of this event space.",
      buttonName: "Publish Event",
  },
  {
      name: "Event Space Details",
      description: "Enter Event Space Details.",
      buttonName: "Edit Details",
  },
  {
      name: "Open Settings",
      description: "Open Settings.",
      buttonName: "Open Settings",
  }
]