// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';


const hello = (req: NextApiRequest, res: NextApiResponse) => {
  fetch('https://tw.rter.info/capi.php')
  .then(function(response) {
    console.log(response)
    return response.json();
  })
  .then(function(myJson) {
    res.status(200).json(myJson)
    console.log(myJson);
  })
  .catch(e => {
    console.warn(e)
  })
}

export default hello