import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get } from "@vercel/edge-config";
import { Ikey } from "../types";

const URL =
  "https://api.vercel.com/v1/edge-config/ecfg_nddxijmb7itjwoksc0bwskuabhq1/items";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key = "", address = "" } = req.query;

  const keys = (await get("keys")) as Ikey[];
  const providedKeyData = keys.find((data) => data.key === key) as Ikey;

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

  const isAddressUsed = keys.find((data) => data.macAddress === address);
  if (isAddressUsed) {
    return res.json({
      message: `Activation failed! MAC address already used !`,
      isActivated: false,
    });
  }

  const updatedKeys = keys.map((data) =>
    data.key === key ? { ...data, macAddress: address as string } : data
  );

  const body = {
    items: [
      {
        operation: "update",
        key: "keys",
        value: updatedKeys,
      },
    ],
  };

  try {
    const createEdgeConfig = await fetch(URL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer 0AAukIqFg380g18ZCGaFEnei`,
        "Content-Type": "application/json",
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
