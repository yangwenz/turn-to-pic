
export default function ButtonList({onClickDownload, onClickHelp, onClickHistory}: {
    onClickDownload: () => void,
    onClickHelp: () => void,
    onClickHistory: () => void
}) {
    const buttonStyle = "bg-transparent text-gray-300 border-slate-500 " +
        "font-bold hover:bg-slate-500 hover:text-black m-2 " +
        "py-2 px-4 rounded-full inline-flex items-center"

    return (
        <div className="flex">
            <button
                onClick={onClickDownload}
                className={buttonStyle}>
                <svg
                    className="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
            </button>
            <button
                onClick={onClickHistory}
                className={buttonStyle}>
                <svg
                    className="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 503.379 503.379"
                >
                    <path d="M458.091,128.116v326.842c0,26.698-21.723,48.421-48.422,48.421h-220.92c-26.699,0-48.421-21.723-48.421-48.421V242.439
		            c6.907,1.149,13.953,1.894,21.184,1.894c5.128,0,10.161-0.381,15.132-0.969v211.594c0,6.673,5.429,12.104,12.105,12.104h220.92
                    c6.674,0,12.105-5.432,12.105-12.104V128.116c0-6.676-5.432-12.105-12.105-12.105H289.835c0-12.625-1.897-24.793-5.297-36.315
                    h125.131C436.368,79.695,458.091,101.417,458.091,128.116z M159.49,228.401c-62.973,0-114.202-51.229-114.202-114.199
                    C45.289,51.229,96.517,0,159.49,0c62.971,0,114.202,51.229,114.202,114.202C273.692,177.172,222.461,228.401,159.49,228.401z
                     M159.49,204.19c49.618,0,89.989-40.364,89.989-89.988c0-49.627-40.365-89.991-89.989-89.991
                    c-49.626,0-89.991,40.364-89.991,89.991C69.499,163.826,109.87,204.19,159.49,204.19z M227.981,126.308
                    c6.682,0,12.105-5.423,12.105-12.105s-5.423-12.105-12.105-12.105h-56.386v-47.52c0-6.682-5.423-12.105-12.105-12.105
                    s-12.105,5.423-12.105,12.105v59.625c0,6.682,5.423,12.105,12.105,12.105H227.981z M367.697,224.456h-131.14
                    c-6.682,0-12.105,5.423-12.105,12.105c0,6.683,5.423,12.105,12.105,12.105h131.14c6.685,0,12.105-5.423,12.105-12.105
                    C379.803,229.879,374.382,224.456,367.697,224.456z M367.91,297.885h-131.14c-6.682,0-12.105,5.42-12.105,12.105
                    s5.423,12.105,12.105,12.105h131.14c6.685,0,12.104-5.42,12.104-12.105S374.601,297.885,367.91,297.885z M367.91,374.353h-131.14
                    c-6.682,0-12.105,5.426-12.105,12.105c0,6.685,5.423,12.104,12.105,12.104h131.14c6.685,0,12.104-5.42,12.104-12.104
                    C380.015,379.778,374.601,374.353,367.91,374.353z"/>
                </svg>
            </button>
            <button
                onClick={onClickHelp}
                className={buttonStyle}>
                <svg
                    className="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                >
                    <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm2,
                    34.4c-.1.1-.1.2-.2.4s-.1.2-.1.3l-.3.3-.3.3h-.3l-.4.2h-.8l-.4-.2h-.3l-.3-.3-.3-.3c0-.1-.1-.2-.1-.3s-.1-.3-.2-.4v-.8c.1-.1.1-.2.2-.4s.1-.2.1-.3l.3-.3a1.9,
                    1.9,0,0,1,1.8-.6h.4l.3.2.3.3.3.3c0,.1.1.2.1.3s.1.3.2.4v.8ZM27.8,27a3.7,3.7,0,0,
                    0-1.6,1.7A1.9,1.9,0,0,1,24.4,30h-.8a2,2,0,0,1-1.1-2.6,7.1,7.1,0,0,1,3.7-3.9A4.9,
                    4.9,0,0,0,25,14.1a5.3,5.3,0,0,0-4.2,1A5.3,5.3,0,0,0,19,18.9a2,2,0,0,1-4,0,9,9,0,
                    0,1,3.2-6.8,8.7,8.7,0,0,1,7.6-1.9,8.7,8.7,0,0,1,7,6.9A8.9,8.9,0,0,1,27.8,27Z"/>
                </svg>
            </button>
        </div>
    )
}
