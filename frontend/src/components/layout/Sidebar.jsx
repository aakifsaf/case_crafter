import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Test Suites', href: '/test-suites', icon: ChartBarIcon },
]

export const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>

                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="/logo.png"
                      alt="AUTOMAGIC QA"
                    />
                    <span className="ml-2 text-xl font-bold">AUTOMAGIC QA</span>
                  </div>
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-5">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="AUTOMAGIC QA"
            />
            <span className="ml-2 text-xl font-bold">AUTOMAGIC QA</span>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}