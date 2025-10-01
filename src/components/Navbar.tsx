import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import LanguageSelector from './theme/languange-selector';

const Navbar = () => {
const { t,i18n} = useTranslation();

  return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <ul className="flex items-center space-x-6">
            <li><Link to="/" className="text-gray-700 hover:text-blue-500">{t("navbar.home")}</Link></li>
            <li><Link to="/about" className="text-gray-700 hover:text-blue-500">{t("navbar.about")}</Link></li>
            <li><Link to="/products" className="text-gray-700 hover:text-blue-500">{t("navbar.products")}</Link></li>
            <li><Link to="/contact" className="text-gray-700 hover:text-blue-500">{t("navbar.contact")}</Link></li>
            <li><LanguageSelector /></li>
          </ul>
        </div>
      </nav>
  )
}

export default Navbar