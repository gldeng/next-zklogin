// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  // DECLARE VARIABLE
  const { managerAddress, caholderAddress } = req.body;
  console.log("managerAddress: ", managerAddress);
  console.log("caholderAddress: ", caholderAddress);
  try {
    // CREATE CA HOLDER ACCOINT
    res.status(200).json({transactionId: "dscdkjbihbri4d"});
  } catch (error) {
    res.status(405).json({ message: error });
  }
}

export default handler;