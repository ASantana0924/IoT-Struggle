import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebaseAdmin";
import { doc, getDoc } from "@firebase/firestore";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "@mantine/core";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

const MacAddressInput = ({ innerRef, register, trigger }) => {
    const [validate, setValidate] = useState("idle");

    const validateBin = async (value) => {
        if (value.length < 1) {
            return "Bin ID length must be greater than 0";
        }
        let binSnap = await getDoc(doc(db, "Mac-To-Users", value));
        console.log("Bin provided: " + binSnap.exists());
        if (binSnap.exists()) {
            setValidate("valid");
            return true;
        } else {
            setValidate("invalid");
            return "Bin ID does not exist. Is your bin connected to WiFi?";
        }
    };

    return (
        <div
            ref={innerRef}
            className="fade-in max-w-5xl w-full h-full justify-center flex flex-col gap-y-1 mb-4"
        >
            <div className="flex items-center text-gray-700 flex-col gap-y-2 mt-4 p-4 px-5 pb-8  mx-4 border-gray-300 border-[1px] rounded-md shadow-lg bg-white">
                <h1 className="text-4xl  text-center font-bold text-lightgreen">
                    Woohoo!
                </h1>
                <p className="font-semibold text-sm w-full text-center">
                    Welcome to IoTrash!
                </p>
                <Image
                    className="w-[90%] my-4"
                    src="/welcome-iot.png"
                    height="556"
                    width="602"
                />
                <p className="text-sm mt-2">
                    Thank you for trying out the app! Before getting started on
                    your recycling journey, we need to set up your IoT Bin!
                </p>
                <div className="w-full flex mt-4 flex-col">
                    <label className="font-bold text-sm" for="mac-address">
                        Bin MAC Adress
                    </label>
                    <p className="text-xs">
                        You can find this value on the sticker on the side of
                        your bin!
                    </p>
                    <div className="flex w-full">
                        <input
                            {...register("bin", {
                                validate: async (value) =>
                                    new Promise((resolve) => {
                                        debounce(
                                            async (value) => {
                                                setValidate("validating");
                                                let val = await validateBin(
                                                    value
                                                );
                                                resolve(val);
                                            },
                                            1000,
                                            { leading: true }
                                        )(value);
                                    }),
                            })}
                            className="px-2 mt-2 w-4/5 py-1 text-base border-[1px] border-gray-300"
                            type="text"
                            placeholder="e.g. A0:B7:65:FE:DB:5C"
                        />
                        <p
                            type="button"
                            className=" mt-2 px-2 flex items-center text-lg"
                        >
                            {validate == "idle" ? (
                                <></>
                            ) : validate == "validating" ? (
                                <Loader size={16} />
                            ) : validate == "invalid" ? (
                                <FontAwesomeIcon
                                    icon={faClose}
                                    className="text-red-500"
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className="text-green-500"
                                />
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MacAddressInput;
