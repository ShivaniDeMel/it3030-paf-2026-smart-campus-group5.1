import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  FireIcon,
  HeartIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    campus: ['About Us', 'Facilities', 'Departments', 'Campus Map'],
    services: ['IT Support', 'Facility Booking', 'Maintenance', 'Emergency'],
    resources: ['Student Portal', 'Library', 'Cafeteria', 'Transportation'],
    legal: ['Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact']
  }

  const socialLinks = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-head">
              <div className="footer__brand-icon-wrap">
                <FireIcon className="footer__brand-icon" />
              </div>
              <div>
                <h3>Smart Campus</h3>
                <p>Operations Hub</p>
              </div>
            </div>

            <p className="footer__brand-text">
              Empowering campus management with technology and seamless
              operations.
            </p>

            <div className="footer__contact">
              <span><MapPinIcon /> SLIIT Campus, Malabe</span>
              <span><PhoneIcon /> 012 3456789</span>
              <span><EnvelopeIcon /> info@smartcampus.edu</span>
              <span><ClockIcon /> 24/7 Support Available</span>
            </div>
          </div>

          <div className="footer__links">
            <h4><AcademicCapIcon /> Campus</h4>
            {footerLinks.campus.map((item) => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>

          <div className="footer__links">
            <h4><BuildingOfficeIcon /> Services</h4>
            {footerLinks.services.map((item) => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>

          <div className="footer__links">
            <h4><UserGroupIcon /> Resources</h4>
            {footerLinks.resources.map((item) => (
              <a key={item} href="#">
                <SparklesIcon />
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <span>© {currentYear} Smart Campus Operations Hub</span>
            <HeartIcon />
            <span>Built with passion for education</span>
          </div>

          <div className="footer__social">
            {socialLinks.map((name) => (
              <a key={name} href="#" aria-label={name}>
                {name.charAt(0)}
              </a>
            ))}
          </div>

          <div className="footer__legal">
            {footerLinks.legal.map((item) => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
