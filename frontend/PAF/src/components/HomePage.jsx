import { FireIcon } from '@heroicons/react/24/outline'

const HomePage = () => {
  return (
    <main className="home-page flex-1">
      <div className="home-page__glow home-page__glow--one" />
      <div className="home-page__glow home-page__glow--two" />
      <section className="home-page__content">
        <div className="home-page__badge">
          <FireIcon className="home-page__badge-icon" />
          Smart Campus Operations Hub
        </div>
        <h1>Manage your campus smarter, faster, better</h1>
        <p>
          Centralize facilities, services, and support operations in one platform
          built for modern campus life.
        </p>
        <div className="home-page__actions">
          <button type="button" className="btn btn--primary">
            Get Started
          </button>
          <button type="button" className="btn btn--ghost">
            Explore Features
          </button>
        </div>
      </section>
    </main>
  )
}

export default HomePage
