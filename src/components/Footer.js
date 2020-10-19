import React from "react";

const Footer = () => (
  <footer className="text-xs text-gray-700 flex flex-col justify-end items-center pb-1 mt-12">
    <span>
      Inspired by{" "}
      <a
        href="https://aatishb.com/covidtrends/"
        className="hover:underline text-gray-900"
      >
        Aatish Bhatia's COVID Trends
      </a>
    </span>
    <span>
      Icons made by{" "}
      <a
        href="https://www.flaticon.com/authors/vitaly-gorbachev"
        title="Vitaly Gorbachev"
        className="hover:underline text-gray-900"
      >
        Vitaly Gorbachev
      </a>{" "}
      from{" "}
      <a
        href="https://www.flaticon.com/"
        title="Flaticon"
        className="hover:underline text-gray-900"
      >
        www.flaticon.com
      </a>
    </span>
    <span>
      © 2020{" "}
      <a
        href="https://github.com/cascandaliato"
        title="GitHub user cascandaliato"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 230 140"
          class="inline h-2 align-baseline fill-current text-gray-900"
        >
          <path d="M75.274922 135.79222c19.121104 0 35.120404-7.5704 47.139384-18.49674l-19.04306-25.36474c-8.11672 7.25822-17.560203 12.25312-28.096324 12.25312-17.950428 0-34.808221-14.36034-34.808221-33.87168 0-19.2772 16.155385-34.02776 35.510629-34.02776 9.287395 0 19.511336 4.60467 27.237826 11.62875l19.19915-24.66233c-12.87748-11.7068-30.28159-18.80892-46.515021-19.04306-39.17876 0-69.304261 28.64264-69.304261 65.87027 0 39.49094 33.169269 65.71417 68.679898 65.71417zM175.875366 134.69959c25.20865 0 47.52961-14.90666 47.52961-38.86658 0-18.57479-13.03357-30.59377-32.70099-38.86658-13.57989-5.69731-22.47706-7.5704-22.47706-13.34575 0-4.2925 4.91685-7.80454 11.78484-7.80454 6.00949 0 15.68712 2.88768 19.43329 9.52153l19.2772-18.57479c-4.91685-12.4092-19.90156-21.46246-39.10071-21.46246-23.88188 0-44.56389 15.53102-44.56389 37.30567 0 18.96502 13.65793 29.42309 29.57918 36.29108 12.33117 5.46317 25.20865 11.16048 25.20865 17.63825 0 5.15099-6.94604 7.72649-14.04816 7.72649-10.53613 0-20.29179-4.68273-25.52083-12.40921l-20.21374 19.82351c6.32167 13.89207 25.1306 23.02338 45.81261 23.02338z" />
        </svg>
      </a>
    </span>
  </footer>
);

export default Footer;
