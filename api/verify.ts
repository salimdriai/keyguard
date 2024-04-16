import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get } from "@vercel/edge-config";
import { IActivationData, STATUS_MESSAGE } from "../types";
import { updateData, ActivationSchema } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const validation = ActivationSchema.safeParse(JSON.parse(req.body));

    if (validation.success === false) {
      return res.status(400).json(validation.error);
    }

    const {
      data: { key, mac, clientName, phoneNumber },
    } = validation;

    const activationData = (await get("activationData")) as IActivationData[];
    const isAddressUsed = activationData.find((data) => data.mac === mac);

    const providedData = activationData.find(
      (data) => data.key === key
    ) as IActivationData;

    if (!providedData) {
      return res.status(400).json({ message: STATUS_MESSAGE.KEY_NOT_FOUND });
    }

    if (providedData?.mac || isAddressUsed) {
      return res.status(400).json({ message: STATUS_MESSAGE.KEY_USED });
    }

    const updatedData: IActivationData[] = activationData.map((data) =>
      data.key === key ? { ...data, mac, clientName, phoneNumber } : data
    );

    const result = await updateData(updatedData);

    if (result.status !== 200) {
      return res
        .status(500)
        .json({ message: STATUS_MESSAGE.DATA_UPDATE_FAILED });
    }

    return res.status(200).json({ message: STATUS_MESSAGE.ACTIVATED });
  } catch (error) {
    res.status(500).json({ message: STATUS_MESSAGE.SERVER_ERROR });
  }
}
