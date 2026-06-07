import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Education from './components/sections/Education'
import Certifications from './components/sections/Certifications'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'
import Admin from './pages/Admin'

// Simple routing — no external library needed
const isAdmin = window.location.pathname === '/admin'

function App() {
  if (isAdmin) return <Admin />

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  )
}

export default App
