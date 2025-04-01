import { NextApiRequest, NextApiResponse } from 'next';

interface CorsResponse {
     message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<CorsResponse>) {
     res.setHeader('Access-Control-Allow-Origin', 'https://pay.payos.vn');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

     if (req.method === 'OPTIONS') {
          return res.status(200).end();
     }

     res.status(200).json({ message: "CORS is configured!" });
}
 