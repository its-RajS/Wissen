import React, { FC, useActionState, useEffect, useRef, useState } from "react";
import { IVerification } from "../../@types/components/verification";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { style } from "../../styles/style";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type VerifyNumber = {
  0: string;
  1: string;
  2: string;
  3: string;
};

const Verification: FC<IVerification> = ({ setRoute }) => {
  const { token, user } = useSelector((state: any) => state.auth); //* Store
  const [activation, { isSuccess, error, isError }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("/Login");
    }
    if (isError) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log(error);
      }
    }
  }, [isSuccess, isError, error]);

  const inputRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verification = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activationToken: token,
      activationCode: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerify = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerify);

    if (value === "" && index !== 0) {
      inputRef[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRef[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={style.title}>Verify your account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2 ">
        <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center bg-blue-500 ">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className=" m-auto flex items-center justify-around ">
        {Object.keys(verifyNumber).map((key, val) => (
          <input
            type="text"
            key={key}
            ref={inputRef[val]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] text-black dark:text-white flex items-center justify-center text-[18px] outline-none font-Poppins text-center ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-blue-200 border-blue-500 "
            } `}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as unknown as keyof VerifyNumber]}
            onChange={(e) => {
              handleInputChange(val, e.target.value);
            }}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="flex justify-center w-full">
        <button
          className={`${style.button} bg-blue-500 `}
          onClick={verification}
        >
          Verify OTP
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 text-[14px] font-Poppins text-black dark:text-white ">
        Go back to SignIn?{" "}
        <span
          className="pl-1 cursor-pointer text-blue-500 "
          onClick={() => setRoute("Login")}
        >
          SignIn
        </span>
      </h5>
    </div>
  );
};

export default Verification;
