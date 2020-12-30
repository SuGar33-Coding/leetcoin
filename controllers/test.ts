import { Request, Response, ParamsDictionary } from "../utils/deps.ts";

export default {
  get(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
    res.setStatus(200).send(`Host Name: '${req.hostname}'`);
  },
};
