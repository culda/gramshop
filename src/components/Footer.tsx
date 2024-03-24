import Link from "next/link";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a
            className="flex title-font font-medium items-center md:mb-0"
            href="/"
          >
            <Logo />
          </a>
          <p className="mt-2 text-sm text-gray-500">
            First ever Telegram ecommerce platform
          </p>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Support
            </h2>
            <nav className="list-none mb-10 flex flex-col md:items-start items-center gap-2">
              <li>
                <a
                  href="https://t.me/+FTPqqyO__eYyNTFk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <div className="flex flex-row gap-2">
                    <img
                      className="text-sm w-6 h-6"
                      src="/telegram-logo.svg"
                      alt="telegram"
                    ></img>
                    Telegram
                  </div>
                </a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Site Map
            </h2>
            <nav className="list-none mb-10 flex flex-col md:items-start items-center gap-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <div className="flex flex-row gap-2">Dashboard</div>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <div className="flex flex-row gap-2">Blog</div>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <div className="flex flex-row gap-2">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <div className="flex flex-row gap-2">Terms of Service</div>
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2024 Gramshop
          </p>
        </div>
      </div>
    </footer>
  );
};
