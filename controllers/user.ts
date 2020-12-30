import { User } from "../models/User.ts";
import { Request, Response, ParamsDictionary } from "../utils/deps.ts";

export default {
    getByName: async (
        req: Request<ParamsDictionary, any, any>,
        res: Response<any>
      ) => {
        const user = await User.where({name: req.params.name}).get();
        res.setStatus(200).send(user);
      }
}
