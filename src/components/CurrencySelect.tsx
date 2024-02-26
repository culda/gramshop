import { UseFormRegisterReturn } from "react-hook-form";
import { Currency } from "@/model";

type PpPriceInput = {
  editMode?: boolean;
  registerProps?: UseFormRegisterReturn;
};

const CurrencySelect = ({ editMode, registerProps }: PpPriceInput) => {
  return (
    <div className="flex flex-col justify-between gap-2 flex-wrap max-w-sm">
      <div className="flex flex-wrap gap-2">
        <select
          disabled={!editMode}
          className="border border-zinc-300 text-black text-sm px-4 py-2.5 rounded-md shadow-sm  disabled:bg-neutral-100 appearance-none"
          {...registerProps}
        >
          <option value={Currency.USD}>USD</option>
          <option value={Currency.EUR}>EUR</option>
          <option value={Currency.GBP}>GBP</option>
        </select>
      </div>
    </div>
  );
};

export default CurrencySelect;
