import Navigation from '@/components/Navigation'
import DonorForm from '@/components/DonorForm'
import BackButton from '@/components/BackButton'

export default function NewDonorPage() {
  return (
    <div className="container">
      <BackButton fallback="/donors" />
      <h1>Add New Donor</h1>
      <DonorForm />
    </div>
  )
}
