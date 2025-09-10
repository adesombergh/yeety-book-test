import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('auth');

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="font-bold text-xl text-text-dark">YeetyBook</span>
          </Link>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4">

            {/* Auth Links */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">
                  {t('signIn.title')}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">
                  {t('signUp.title')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
