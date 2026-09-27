import React from "react";
import { Link } from "react-router-dom";

import IconUser from "../assets/User.svg";
import IconSetting from "../assets/Setting.svg";

import "../style.css";

const NAV_ITEMS = [
    { url: "/profile", image: IconUser, alt: "icona profilo utente", ariaLabel: "Profilo Utente" },
    { url: "/settings", image: IconSetting, alt: "icona impostazioni applciazione", ariaLabel: "Impostazioni" },
];

function Header({ userName = "Utente" }) {
    return (
        <header className="navbar relative bg-[#FAFAFA] p-0 w-full grid grid-cols-3 py-8 items-center">
            
           
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#EED186] focus:text-[#6F4E37] focus:font-bold focus:rounded-br-lg top-0 left-0 outline-none"
            >
                Salta al contenuto principale
            </a>

            <div className="justify-self-start"></div>

            <div className="justify-self-center">
                <p className="text-3xl font-archivo font-extralight text-[#6F4E37]">
                    Welcome {userName}
                </p>
            </div>

            <nav className="justify-self-end" aria-label="Navigazione Utente">
                <ul className="menu menu-horizontal p-0">
                    {NAV_ITEMS.map((item, index) => (
                        <li key={index} className="mr-8">
                            <Link 
                                to={item.url} 
                                className="p-0 hover:bg-transparent rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAFAFA] transition-shadow"
                                aria-label={item.ariaLabel}
                            >
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-10 h-10 object-cover"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;