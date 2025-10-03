import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  XMarkIcon,
  Cog6ToothIcon,
  UserIcon,
  DocumentDuplicateIcon,
  DocumentArrowUpIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Templates', href: '/templates', icon: DocumentDuplicateIcon },
  { name: 'Upload BRD', href: '/upload', icon: DocumentArrowUpIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
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
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-500 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-500 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-gray-700/50">
                <div className="absolute top-0 right-0 -mr-14 pt-4">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="h-0 flex-1 overflow-y-auto pt-8 pb-4">
                  <div className="flex flex-shrink-0 items-center px-6 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">C</span>
                    </div>
                    <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      CaseCrafter
                    </span>
                  </div>
                  <nav className="mt-8 space-y-2 px-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 bg-gray-800/50 border border-gray-700/30 hover:border-blue-400/50 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                      >
                        <item.icon
                          className="mr-4 h-5 w-5 flex-shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
                
                {/* Mobile footer */}
                <div className="flex flex-shrink-0 border-t border-gray-700/50 p-4">
                  <div className="group flex items-center rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white w-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300">
                    <UserIcon className="mr-3 h-5 w-5" />
                    Profile
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 backdrop-blur-sm overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CaseCrafter
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-500 bg-gray-800/30 border border-gray-700/30 hover:border-blue-400/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                  <item.icon
                    className="mr-4 h-5 w-5 flex-shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 z-10"
                    aria-hidden="true"
                  />
                  <span className="z-10">{item.name}</span>
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1 h-6 bg-blue-400 rounded-full"></div>
                  </div>
                </a>
              ))}
            </nav>
          </div>
          
          {/* Desktop footer */}
          <div className="flex-shrink-0 border-t border-gray-700/50 p-6">
            <div className="group flex items-center justify-between rounded-2xl px-6 py-4 text-sm text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <span className="ml-3">User Name</span>
              </div>
              <Cog6ToothIcon className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}