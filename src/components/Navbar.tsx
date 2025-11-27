import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import LanguageSelector from './theme/languange-selector';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="bg-background shadow-md transition-colors duration-200 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <ul className="flex items-center space-x-6">
          <li><Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">{t("navbar.home")}</Link></li>
          <li><Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">{t("navbar.about")}</Link></li>
          <li><Link to="/products" className="text-foreground hover:text-primary transition-colors font-medium">{t("navbar.products")}</Link></li>
          <li><Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">{t("navbar.contact")}</Link></li>
          <li><ThemeToggle /></li>
          <li><LanguageSelector /></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar