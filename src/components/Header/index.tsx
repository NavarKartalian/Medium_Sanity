import Link from 'next/link';

export function Header() {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto'>
      <nav className='flex items-center space-x-5'>
        <Link href='/' passHref>
          <img 
            className='w-44 object-contain cursor-pointer' 
            src="https://links.papareact.com/yvf" 
            alt="Medium logo" 
          />
        </Link>

        <div className='hidden md:inline-flex items-center space-x-5'>
          <h3 className='cursor-pointer hover:text-yellow-500 transition ease-out duration-300'>
            About
          </h3>
          <h3 className='cursor-pointer hover:text-yellow-500 transition ease-out duration-300'>
            Contact
          </h3>
          <h3 
            className='text-white bg-green-600 px-4 py-1 rounded-full cursor-pointer 
              hover:bg-green-500 transition ease-in-out duration-300'
          >
            Follow
          </h3>
        </div>
      </nav>

      <div className='flex items-center space-x-5 text-green-600'>
        <h3 className='cursor-pointer'>Sign In</h3>
        <button className='border px-4 py-1 rounded-full border-green-600 hover:bg-green-600 
          hover:text-white cursor-pointer transition ease-in-out duration-300'
        >
          Get Started
        </button>
      </div>
    </header>
  );
}