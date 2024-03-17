import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { key = "" } = req.query;

  return res.json({
    message: `Activation key: ${key}!`,
  });
}
