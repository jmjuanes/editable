import React from "react";
import Rouct from "rouct";
import classNames from "classnames";
import {BarsIcon, FilePlusIcon, renderIcon} from "@josemi-icons/react";

// Available navbar links
const navbarLinks = {
    "/profile": "My Notebooks",
    "/explore": "Explore",
};

export const Link = props => {
    const handleClick = event => {
        event.preventDefault();
        Rouct.redirect(props.to);
    };
    return (
        <a href={"." + props.to} className={props.className} onClick={handleClick}>
            {props.children}
        </a>
    );
};

const NavbarLink = props => {
    const classList = classNames({
        "flex items-center gap-1 text-gray-800 px-3 py-2": true,
        "rounded-md hover:bg-gray-200 no-underline": !props.active,
        "font-bold": props.active,
    });
    return (
        <Link to={props.to} className={classList}>
            {props.icon && (
                <div className="flex items-center">
                    {renderIcon(props.icon)}
                </div>
            )}
            <div className="flex text-sm">
                {props.text || props.children}
            </div>
        </Link>
    );
};

const CreateNotebookButton = props => (
    <div className="flex items-center gap-2 text-white bg-gray-900 hover:bg-gray-800 rounded-full px-4 py-2" onClick={props.onClick}>
        <div className="flex items-center text-white">
            <FilePlusIcon />
        </div>
        <div className="flex font-bold text-sm">
            <strong>New</strong>
        </div>
    </div>
);

export const Layout = props => (
    <div className="">
        {/* Header */}
        <div className="">
            <div className="w-full maxw-6xl h-16 px-6 mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-gray-800 no-underline">
                    <div className="rounded-lg bg-gray-900 w-8 h-8" />
                    <div className="font-bold flex items-center text-xl">
                        <span>Notelab</span>
                    </div>
                    {/*
                    <div className="flex items-center font-bold text-2xs bg-gray-200 px-2 py-1 rounded-lg">
                        <span>v{pkg.version}</span>
                    </div>
                    */}
                </Link>
                <div className="group peer sm:w-full" tabIndex="0">
                    <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                        <BarsIcon />
                    </div>
                    <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block sm:w-full group-focus-within:block z-5">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center rounded-md bg-white p-4 sm:p-0 w-72 sm:w-full">
                            <div className="pr-12 sm:pr-0 sm:flex sm:mx-auto">
                                <Rouct.Route path="*" render={request => (
                                    <React.Fragment>
                                        {Object.keys(navbarLinks).map(key => (
                                            <NavbarLink
                                                key={key}
                                                to={key}
                                                text={navbarLinks[key]}
                                                active={request.pathname === key}
                                            />
                                        ))}
                                    </React.Fragment>
                                )} />
                            </div>
                            <div className="flex">
                                <CreateNotebookButton onClick={props.onCreateNotebook} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fixed top-0 left-0 w-full h-full sm:h-0 peer-focus-within:block hidden sm:hidden bg-gray-900 o-60 z-2" />
            </div>
        </div>
        {/* Main content */}
        <div className="w-full maxw-6xl mx-auto px-6 pb-16">
            {props.children}
        </div>
        {/* Footer */}
        <div className="w-full border-t border-gray-300">
            <div className="w-full maxw-6xl mx-auto px-6 pt-10 pb-20 text-sm">
                Designed by <a href="https://josemi.xyz" target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">Josemi</a>. 
                Source code available on <a href={process.env.URL_REPOSITORY} target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">GitHub</a>.
            </div>
        </div>
    </div>
);
