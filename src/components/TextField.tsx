"use client";

import React, { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FaCopy } from "react-icons/fa";

type PpTextField = {
  editMode?: boolean;
  defaultValue?: string;
  textarea?: boolean;
  onCopy?: () => void;
  pretext?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  registerProps?: UseFormRegisterReturn;
  errorMessage?: string;
};

const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  PpTextField
>(
  (
    {
      editMode = false,
      textarea,
      defaultValue,
      onCopy,
      errorMessage,
      pretext,
      inputProps,
      registerProps,
    },
    ref
  ) => {
    const inputClass = `flex flex-grow min-w-0 text-black ${
      editMode ? "bg-white" : "bg-neutral-50"
    } text-sm text-gray-600 focus:outline-none rounded-md py-2.5 px-1 ${
      pretext ? "" : "text-center"
    }`;

    return (
      <div className="flex flex-col justify-between gap-2 flex-wrap">
        {textarea ? (
          <div className="flex border-zinc-300 border default-focus-within rounded-md bg-neutral-50">
            <textarea
              disabled={!editMode}
              defaultValue={defaultValue}
              className={inputClass}
              rows={6}
              {...registerProps}
            />
          </div>
        ) : (
          <div
            className={`relative flex bg-neutral-50 items-center border ${
              errorMessage ? "border-red-600" : "border-zinc-300"
            } rounded-md default-focus-within `}
          >
            {pretext && <span className="font-bold pl-3 pr-1 ">{pretext}</span>}
            <input
              type="text"
              className={inputClass}
              disabled={!editMode}
              defaultValue={defaultValue}
              {...inputProps}
              {...registerProps}
            />
            {onCopy && !editMode && (
              <div className="absolute right-4 inset-y-0 flex items-center">
                <button type="button" onClick={onCopy}>
                  <FaCopy className="text-lg" />
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`mt-2 h-4 text-sm ${errorMessage ? "text-red-600" : ""} ${
            errorMessage ? "visible" : "invisible"
          }`}
        >
          {errorMessage}
        </div>
      </div>
    );
  }
);
TextField.displayName = "TextField";

export default TextField;
