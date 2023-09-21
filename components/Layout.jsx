import React from "react";
import {BarsIcon, FilePlusIcon, renderIcon} from "@josemi-icons/react";

const Logo = () => (
    <span className="font-crimson tracking-tight leading-none select-none">
        <span>Editabl<u>e</u></span>
    </span>
);

const NavbarLink = props => (
    <a href={props.to} className="flex items-center gap-1 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200">
        {props.icon && (
            <div className="flex items-center">
                {renderIcon(props.icon)}
            </div>
        )}
        <div className="flex text-sm">
            {props.text || props.children}
        </div>
    </a>
);

const CreateNotebookButton = () => (
    <a href="./" target="_blank" className="flex items-center gap-1 border border-gray-300 hover:bg-gray-100 rounded-md p-2">
        <div className="flex items-center text-gray-900 text-xl">
            <FilePlusIcon />
        </div>
        <div className="flex font-bold text-sm text-gray-900">
            <strong>New</strong>
        </div>
    </a>
);

export const Layout = props => (
    <div className="">
        {/* Header */}
        <div className="w-full border-b-1 border-gray-300">
            <div className="w-full maxw-6xl h-20 px-6 mx-auto flex items-center justify-between">
                <a href="./" className="flex items-center gap-2 text-gray-800 no-underline select-none">
                    <div className="flex items-center text-4xl">
                        <Logo />
                    </div>
                </a>
                <div className="group peer sm:w-full" tabIndex="0">
                    <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                        <BarsIcon />
                    </div>
                    <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block sm:w-full group-focus-within:block z-5">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center rounded-md bg-white p-4 sm:p-0 w-72 sm:w-full">
                            <div className="pr-12 sm:pr-0 sm:flex sm:mx-auto">
                                {/*
                                <NavbarLink to="./" text="Explore" />
                                */}
                            </div>
                            <div className="flex">
                                <CreateNotebookButton />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fixed top-0 left-0 w-full h-full sm:h-0 peer-focus-within:block hidden sm:hidden bg-gray-900 o-60 z-2" />
            </div>
        </div>
        {/* Main content */}
        <div className="w-full maxw-6xl mx-auto px-6 py-8">
            {props.children}
        </div>
        {/* Footer */}
        <div className="w-full maxw-6xl mx-auto px-6 pt-24 pb-20">
            <div className="mb-10">
                <div className="text-2xl mb-2">
                    <Logo />
                </div>
                <div className="text-sm text-gray-600">
                    <span>Please be aware that <b>Editable is currently in active development</b>. </span>
                    <span>While the app is fully functional and offers a range of features, we are continuously working to enhance and expand its capabilities.</span>
                </div>
            </div>
            <div className="text-sm">
                Designed by <a href="https://josemi.xyz" target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">Josemi</a>. 
                Source code available on <a href={process.env.URL_REPOSITORY} target="_blank" className="text-gray-800 hover:text-gray-700 font-medium underline">GitHub</a>.
            </div>
        </div>
    </div>
);
