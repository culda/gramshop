import Button from "./Button";
import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="md:px-8 bg-gray-200 sticky top-0 z-50 shadow-xl py-2 ">
      <div className="mx-auto justify-between flex flex-wrap px-5 items-center">
        <a
          className="flex title-font font-medium items-center md:mb-0"
          href="/"
        >
          <Logo text />
        </a>

        <div className="hidden sm:block">
          <span className="sm:text-xl lg:text-3xl font-bold text-center py-5">
            Start accepting Crypto payments via Telegram
          </span>
        </div>

        {/* <div className="flex flex-row gap-4 text-lg">
            <a href="#faq">Faq</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
          </div> */}

        <div>
          <Button href="/dashboard">Try Free</Button>
        </div>
      </div>
    </header>
  );
};
