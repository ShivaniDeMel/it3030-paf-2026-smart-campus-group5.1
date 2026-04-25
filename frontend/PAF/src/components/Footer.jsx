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
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    campus: [
      { name: 'About Us', href: '#about' },
      { name: 'Facilities', href: '#facilities' },
      { name: 'Departments', href: '#departments' },
      { name: 'Campus Map', href: '#map' },
    ],
    services: [
      { name: 'IT Support', href: '#it-support' },
      { name: 'Facility Booking', href: '#booking' },
      { name: 'Maintenance', href: '#maintenance' },
      { name: 'Emergency', href: '#emergency' },
    ],
    resources: [
      { name: 'Student Portal', href: '#portal' },
      { name: 'Library', href: '#library' },
      { name: 'Cafeteria', href: '#cafeteria' },
      { name: 'Transportation', href: '#transport' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Accessibility', href: '#accessibility' },
      { name: 'Contact', href: '#contact' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#facebook' },
    { name: 'Twitter', href: '#twitter' },
    { name: 'LinkedIn', href: '#linkedin' },
    { name: 'Instagram', href: '#instagram' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-transparent to-orange-500 animate-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                    <FireIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Smart Campus</h3>
                  <p className="text-sm text-orange-400">Operations Hub</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Empowering campus management with cutting-edge technology and seamless operations. 
                Your complete solution for facility management and campus services.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <MapPinIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">SLIIT Campus, Malabe</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <PhoneIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">012 3456789</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <EnvelopeIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">info@smartcampus.edu</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <ClockIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">24/7 Support Available</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Campus
                </h4>
                <ul className="space-y-2">
                  {footerLinks.campus.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm flex items-center group"
                      >
                        <SparklesIcon className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Services
                </h4>
                <ul className="space-y-2">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm flex items-center group"
                      >
                        <SparklesIcon className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Resources
                </h4>
                <ul className="space-y-2">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm flex items-center group"
                      >
                        <SparklesIcon className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© {currentYear} Smart Campus Operations Hub</span>
                <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
                <span>Built with passion for education</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-orange-400 transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors duration-300">
                      <span className="text-xs font-medium">{social.name.charAt(0)}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-6 text-sm">
                {footerLinks.legal.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"></div>
        
        {/* Animated Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
      </div>
    </footer>
  );
};

export default Footer;
