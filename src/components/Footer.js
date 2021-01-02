import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = ({ className }) => (
  <footer
    className={`${className} text-xs text-gray-700 flex flex-col justify-end items-center pb-1`}
  >
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
      Favicon made by{" "}
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
    <span className="order-first sm:order-3">
      Built by{" "}
      <a
        href="https://cascandaliato.com"
        title="Author's home page"
        className="hover:underline text-gray-900"
      >
        Carmelo Scandaliato
      </a>{" "}
      <a
        href="https://github.com/cascandaliato/covid19-chart"
        title="Project's GitHub repository"
        className="hover:underline text-gray-900"
      >
        <FontAwesomeIcon icon={faGithub} size="lg" />
      </a>{" "}
      <a
        href="https://twitter.com/cascandaliato"
        title="Author's Twitter profile"
        className="hover:underline text-gray-900"
      >
        <FontAwesomeIcon icon={faTwitter} size="lg" />
      </a>
    </span>
  </footer>
);

export default Footer;
