import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-gray-300 transition">
                Signup
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-gray-300 transition">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/users" className="hover:text-gray-300 transition">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

