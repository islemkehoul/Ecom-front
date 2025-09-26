import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link></li>
            <li><Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link></li>
            <li><Link to="/products" className="text-gray-700 hover:text-blue-500">Products</Link></li>
            <li><Link to="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link></li>
          </ul>
        </div>
      </nav>
  )
}

export default Navbar