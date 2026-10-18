import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
    name: "currency",
    initialState: {
        currencySymbol: "MVR",
        currencyName: "MVR",
        currencyRate: 1
    },
    reducers: {
        setCurrency(state, action) {
            const currencyName = action.payload;

            if (currencyName === "MVR") {
                return state = {
                    currencySymbol: "MVR",
                    currencyRate: 1,
                    currencyName
                };
            }
            if (currencyName === "USD") {
                return state = {
                    currencySymbol: "$",
                    currencyRate: 0.06485,
                    currencyName
                };
            }
            if (currencyName === "EUR") {
                return state = {
                    currencySymbol: "€",
                    currencyRate: 0.06485,
                    currencyName
                };
            }
            if (currencyName === "GBP") {
                return state = {
                    currencySymbol: "£",
                    currencyRate: 1,
                    currencyName
                };
            }
        }
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
