import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function CreateOfferButton() {
  return (
    <Button>
      <Link to="/offers/create">Utwórz ofertę</Link>
    </Button>
  )
}

export default CreateOfferButton