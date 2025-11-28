import Link from "next/link";
import TopNav from '@/components/ui/dashboard/top-nav';

export default function Home() {
  // redirect('/dashboard');

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <TopNav/>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="py-10 md:py-20">
            <p className="text-lg md:text-2xl mx-auto mb-0 text-center">
              Sean Eidref Natividad&apos;s 
            </p>
            <p className="text-6xl md:text-8xl !leading-tight mt-0 text-center">
              PROJECTS
            </p>
          </div>

          <main className="flex-1 flex flex-col gap-6 px-4">
            <Link href="/dashboard">
              <div className='p-2 rounded border-[1px] border-foreground bg-card'>
                <h2 className="font-medium text-lg mb-4">
                  Forms &nbsp;
                  <span className="text-xs text-muted-foreground">
                    (click to view)
                  </span>
                </h2>
                <p>A dynamic form-builder web app that lets you create custom forms, collect responses, and view analytics.</p>
              </div>
            </Link>
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            © 2025 Sean Eidref Natividad. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
