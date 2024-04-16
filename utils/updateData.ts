import { IActivationData } from "../types";

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG_URL as string;
const AUTH_TOKEN = process.env.AUTH_TOKEN as string;

export const updateData = async (data: IActivationData[]) => {
  const result = await fetch(EDGE_CONFIG_URL, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body: JSON.stringify({
      items: [
        {
          operation: "update",
          key: "activationData",
          value: data,
        },
      ],
    }),
  });

  return result;
};
