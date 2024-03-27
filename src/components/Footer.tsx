import Link from "next/link";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        {/* Logo and Introduction */}
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a
            className="flex title-font font-medium items-center md:justify-start justify-center"
            href="/"
          >
            <Logo />
            <span className="ml-3 text-xl">Gramshop</span>
          </a>
          <p className="mt-2 text-sm text-gray-500">
            Revolutionize your business with Gramshop, the first-ever Telegram
            ecommerce platform. Seamlessly convert your shop from Shopify or
            WooCommerce and engage with customers directly on Telegram.
          </p>
        </div>

        {/* Enhanced Links with Keywords */}
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          {/* Support Section */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Support
            </h2>
            <nav className="list-none mb-10">
              <li>
                <a
                  href="https://t.me/+FTPqqyO__eYyNTFk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Join Our Telegram Support Group
                </a>
              </li>
            </nav>
          </div>

          {/* Site Map with Keyword Rich Links */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Explore
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link href="/dashboard">
                  <span className="text-gray-600 hover:text-gray-800">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-gray-600 hover:text-gray-800">
                    Ecommerce Insights
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog/shopify-to-telegram">
                  <span className="text-gray-600 hover:text-gray-800">
                    Shopify to Telegram Guide
                  </span>
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Gramshop - Your Gateway to Telegram
            Ecommerce
          </p>
        </div>
      </div>
    </footer>
  );
};
