import {FaCog, FaKey} from "react-icons/fa";
import {useState} from "react";
import {useSettings} from "@/hooks/useSettings";


export default function Settings({showModal, setShowModal}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void}
) {
    const {settings, saveSettings} = useSettings();
    const [apikey, setAPIKey] = useState(settings.apikey);

    function keyIsValid(key: string | undefined) {
        const pattern = /^r8_[a-zA-Z0-9]{37}$/;
        return key && pattern.test(key);
    }

    async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAPIKey(e.target.value);
    }

    async function onClickSave() {
        if (!keyIsValid(apikey)) {
            alert("The API Key is invalid!");
            return;
        }
        saveSettings({apikey: apikey})
        setShowModal(false);
    }

    return (
        <div>
            {showModal ? (
                <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-gray-900"
                    >
                        <div className="flex items-center justify-center border-b-2 border-slate-500
                            text-gray-300 rounded-t-lg pt-2 pb-2"
                        >
                            <h2 className="text-white text-center text-xl font-bold">
                                Settings
                            </h2>
                            <FaCog className="text-white text-xl ml-2"/>
                        </div>
                        <div className="text-gray-300 mt-2 text-left px-4">
                            Please set your Replicate API key here:
                        </div>
                        <div className="mt-3 mb-2">
                            <div className="flex m-4">
                                <div className="text-gray-300 flex flex-row items-center
                                    font-bold pt-2 pb-2 pr-2"
                                >
                                    <p>Replicate API</p>
                                    <FaKey className="ml-1"/>
                                </div>
                                <input
                                    type="text"
                                    name="apikey"
                                    value={apikey}
                                    placeholder="r8_PT67qpcPYfcc94KOzLlibtMHWuOs7G13xxxxx"
                                    className="border border-gray-300 text-gray-900 text-small rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block sm:w-96 p-2"
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="text-gray-300 mb-2 text-left px-4">
                            Your API key will be stored exclusively on your local device
                        </div>
                        <button
                            className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-br from-gray-500 to-gray-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                        <button
                            className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                            onClick={onClickSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
