import { RestaurantCreateForm } from '@/components/restaurant/create-form'

export const WizardContent = () => {
  return (
    <div className="container mx-auto px-4 py-24  h-screen flex">
      <div className="max-w-2xl mx-auto ">
        <RestaurantCreateForm />
      </div>
    </div>
  )
}
