import { useAppSelector } from '../hooks/redux'

export default function AuthDebug() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-1">Auth Debug</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      {user && (
        <div className="mt-1">
          <div>Role: {user.role}</div>
          <div>Name: {user.displayName}</div>
          <div>Email: {user.email}</div>
        </div>
      )}
    </div>
  )
}