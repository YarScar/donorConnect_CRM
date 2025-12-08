import Navigation from '@/components/Navigation'
import DonorForm from '@/components/DonorForm'

export default function NewDonorPage() {
  return (
    <div className="container">
      <Navigation />
      <h1>Add New Donor</h1>
      <DonorForm />
    </div>
  )
}
