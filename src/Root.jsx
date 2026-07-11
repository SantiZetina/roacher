import { Suspense, lazy } from 'react'
import App from './App.jsx'

// The admin panel lives at /admin without a router — one page, one branch.
// Its code only loads when the path matches, so visitors never download it.
const Admin = lazy(() => import('./admin/Admin.jsx'))
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'

export default function Root() {
  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }
  return <App />
}
