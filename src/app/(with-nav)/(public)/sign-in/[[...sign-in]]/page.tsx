import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          },
        }}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/coucou"
      />
    </div>
  )
}
