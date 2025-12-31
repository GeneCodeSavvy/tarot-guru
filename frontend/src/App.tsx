import { Hero } from '@/components/hero'
import { TorchlightCursor } from '@/components/effects/torchlight-cursor'

function App() {
  return (
    <TorchlightCursor>
      <Hero />
    </TorchlightCursor>
  )
}

export default App
