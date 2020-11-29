import React from "react";

const Header = ({ className }) => (
  <header className={className}>
    <div className="bg-red-600 shadow-sm py-1 sm:py-4">
      <p className="animate__animated animate__fadeInDown font-bold text-lg sm:text-3xl text-white text-center">
        COVID-19 growth in Italian Regions
      </p>
    </div>
    <div className="flex items-center justify-center">
      <p className="max-w-2xl text-left mx-6 mt-2 sm:mt-5 text-sm sm:text-base">
        This interactive chart compares the number of total cases with the
        number of new cases in the previous week. It is plotted using a{" "}
        <a
          href="https://en.wikipedia.org/wiki/Logarithmic_scale"
          className="text-red-600 hover:underline"
        >
          logarithmic scale
        </a>{" "}
        so that{" "}
        <a
          href="https://en.wikipedia.org/wiki/Exponential_growth"
          className="text-red-600 hover:underline"
        >
          exponential growth
        </a>{" "}
        is represented by a straight line along which cases double every week.
      </p>
    </div>
  </header>
);

export default Header;
