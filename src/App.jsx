import PhotosProvider from './data/PhotosProvider.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Gallery from './components/Gallery.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import WebGPUBadge from './components/WebGPUBadge.jsx'

export default function App() {
  return (
    <PhotosProvider>
      <div className="bg-ink font-sans text-paper">
        {import.meta.env.DEV && <WebGPUBadge />}
        <Header />
        <main>
          <Hero />
          <Gallery />
          <Marquee />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </PhotosProvider>
  )
}
