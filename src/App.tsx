import { Toaster } from 'sonner';
import Routes from './Routes';
// import { useAuth } from '@clerk/clerk-react';
// import { useEffect } from 'react';

const App = () => {

  return (
    <div>
      <Toaster position='top-right' />
    <Routes />
    </div>
  )
}

export default App
