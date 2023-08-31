import { NextApiResponse } from "next";

export const formatTimestamp = (date: number) => {
    if (typeof (date) !== "number") return null;
    return new Date(date).toISOString();
}

