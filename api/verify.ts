import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get } from "@vercel/edge-config";
import { IActivationData } from "../types";

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG_URL as string;
const AUTH_TOKEN = process.env.AUTH_TOKEN as string;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key = "", address = "" } = req.query;

  const activationData = (await get("activationData")) as IActivationData[];
  const providedKeyData = activationData.find(
    (data) => data.key === key
  ) as IActivationData;

  if (!providedKeyData) {
    res.json({
      message: `Activation failed! Cannot find key !`,
      isActivated: false,
    });
  }

  if (providedKeyData?.macAddress) {
    res.json({
      message: `Activation failed! Key already used !`,
      isActivated: false,
    });
  }

  const isAddressUsed = activationData.find(
    (data) => data.macAddress === address
  );
  if (isAddressUsed) {
    return res.json({
      message: `Activation failed! MAC address already used !`,
      isActivated: false,
    });
  }

  const updatedData = activationData.map((data) =>
    data.key === key ? { ...data, macAddress: address as string } : data
  );

  const body = {
    items: [
      {
        operation: "update",
        key: "activationData",
        value: updatedData,
      },
    ],
  };

  try {
    const createEdgeConfig = await fetch(EDGE_CONFIG_URL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify(body),
    });

    const result = await createEdgeConfig.json();

    return res.json({
      message: `Activated!`,
      isActivated: true,
      status: result.status,
    });
  } catch (error) {
    console.log(error);
  }
}
