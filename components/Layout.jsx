const React = require("react");
const {BarsIcon, FilePlusIcon, renderIcon} = require("@josemi-icons/react/cjs");

const Logo = () => (
    <div className="inline-flex items-center gap-1 text-gray-800">
        <span className="leading-none select-none font-black">
            <span>editable.</span>
        </span>
    </div>
);

const NavbarLink = props => (
    <a href={props.to} target={props.target} className="flex items-center gap-1 text-gray-800 px-3 py-2 rounded-md hover:bg-yellow-100">
        {props.icon && (
            <div className="flex items-center">
                {renderIcon(props.icon)}
            </div>
        )}
        <div className="flex text-sm font-bold">
            {props.text || props.children}
        </div>
    </a>
);

const CreateNotebookButton = () => (
    <a href="./" target="_blank" className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 rounded-md px-3 py-2">
        <div className="flex items-center text-white text-xl">
            <FilePlusIcon />
        </div>
        <div className="flex font-bold text-sm text-white">
            <strong>Create New</strong>
        </div>
    </a>
);

export const Layout = props => (
    <div className="">
        {/* Header */}
        <div className="w-full border-gray-300">
            <div className="w-full max-w-7xl h-20 px-6 mx-auto flex items-center">
                <div className="flex items-center">
                    <a href="./" className="flex items-center gap-2 text-gray-900 no-underline select-none">
                        <div className="flex items-center text-2xl">
                            <Logo />
                        </div>
                    </a>
                </div>
                <div className="group peer sm:w-full ml-auto sm:ml-8" tabIndex="0">
                    <div className="flex sm:hidden text-xl p-2 border border-gray-300 rounded-md cursor-pointer">
                        <BarsIcon />
                    </div>
                    <div className="fixed sm:initial top-0 right-0 p-6 sm:p-0 hidden sm:block sm:w-full group-focus-within:block z-5">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-md bg-white p-4 sm:p-0 w-72 sm:w-full">
                            <div className="pr-12 sm:pr-0 sm:flex">
                                <NavbarLink to="./about" target={props.navbarLinkTarget} text="About" />
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
        <div className="w-full max-w-6xl mx-auto px-6 py-2 md:py-8">
            {props.children}
        </div>
        {/* Footer */}
        <div className="w-full max-w-6xl mx-auto px-6 pt-8 pb-20">
            <div className="h-px bg-gray-200 w-full mb-6" />
            <div className="mb-10">
                <div className="text-xl mb-2">
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

Layout.defaultProps = {
    navbarLinkTarget: "_blank",
};
