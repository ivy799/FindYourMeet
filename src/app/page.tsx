import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans">
      <div className="relative isolate overflow-hidden px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-black dark:text-white sm:text-4xl">
            Find Your Perfect Meeting Space
          </h2>
          <p className="mt-6 text-lg/8 text-pretty text-black dark:text-white">
            Discover and book the ideal meeting rooms for your team. Connect,
            collaborate, and achieve more with FindYourMeet.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 lg:justify-start">
            <a
              href="#"
              className="w-full sm:w-auto bg-black dark:bg-white px-3.5 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white rounded-md transition-colors"
            >
              Get started
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Learn more
              <span aria-hidden="true" className="ml-1">→</span>
            </a>
          </div>
        </div>
        <div className="relative mt-16 h-80 lg:mt-8 lg:h-auto lg:flex-1 lg:flex lg:justify-center lg:items-center">
          <div className="relative w-full max-w-2xl">
            <Image
              width={20024}
              height={1080}
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              alt="App screenshot"
              className="w-full h-auto object-contain ring-1 ring-black/10 dark:ring-white/10 rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
