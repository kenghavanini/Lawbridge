import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-3xl">
          ✉️
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Check Your Email</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          We have sent a verification link to your email address. Please click the link inside to verify your account and access the marketplace.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="w-full inline-block rounded-lg bg-indigo-600 py-3 font-medium text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
