import { Link } from "react-router-dom";
import {
  FireIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BellIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Facilities Catalogue",
    description: "Browse every campus facility with live availability and rich detail.",
    icon: BuildingOfficeIcon,
    color: "from-orange-500 to-orange-600",
    link: "/facilities",
  },
  {
    title: "Dashboard",
    description: "Track utilization, status and booking trends at a glance.",
    icon: ChartBarIcon,
    color: "from-yellow-500 to-orange-500",
    link: "/dashboard",
  },
  {
    title: "Booking Workflow",
    description: "Reserve rooms, labs and equipment in a streamlined flow.",
    icon: QrCodeIcon,
    color: "from-red-500 to-orange-600",
    link: "/booking-workflow",
  },
  {
    title: "Notifications",
    description: "Stay on top of campus events, reminders and announcements.",
    icon: BellIcon,
    color: "from-pink-500 to-orange-500",
    link: "/notifications",
  },
  {
    title: "Role Management",
    description: "Admin tools to manage users, roles and permissions.",
    icon: ShieldCheckIcon,
    color: "from-purple-500 to-orange-500",
    link: "/role-management",
  },
];

const HomePage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-black/40 backdrop-blur text-orange-200 text-sm animate-fade-in">
          <SparklesIcon className="h-4 w-4 text-orange-300" />
          Smart Campus Operations Hub
        </div>

        <h1
          className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="gradient-text">Manage your campus</span>
          <br />
          <span className="text-white drop-shadow">smarter, faster, better</span>
        </h1>

        <p
          className="mt-6 max-w-2xl mx-auto text-lg text-orange-100/80 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Centralize facilities, services, and support operations in one platform
          built for modern campus life.
        </p>

        <div
          className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/dashboard" className="button-primary">
            <FireIcon className="h-5 w-5" />
            Get Started
          </Link>
          <Link to="/facilities" className="button-ghost">
            <BuildingOfficeIcon className="h-5 w-5" />
            Explore Facilities
          </Link>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="group relative overflow-hidden rounded-2xl border border-orange-700/40 bg-gradient-to-br from-black via-orange-950/70 to-black backdrop-blur p-6 hover:border-orange-500/60 hover:shadow-[0_20px_40px_-20px_rgba(249,115,22,0.6)] transform hover:scale-[1.03] transition-all duration-300 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg animate-pulse-glow`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-orange-100/70 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-orange-300 group-hover:text-white transition-colors text-sm font-semibold">
                  Open
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
