
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products.list'
import Contact from './pages/Contact'
import ProductDetails from './pages/Product.form'
import Layout from './components/layout'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
