import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function AuthLayout() {
  return (
    <>
      <div className="bg-slate-900 min-h-screen flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto py-10 px-5">
              <h1 className="text-5xl font-black text-white text-center">
                  Kanvas
                  <span className="text-fuchsia-500">.</span>
              </h1>
              <div className="mt-8">
                  <Outlet />
              </div>
          </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
}