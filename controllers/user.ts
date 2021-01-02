import { User } from "../models/User.ts";
import { Request, Response, ParamsDictionary, NextFunction } from "../utils/deps.ts";

export default {
    getByName: async (
        req: Request<ParamsDictionary, any, any>,
        res: Response<any>,
        next: NextFunction
      ) => {
        try {
          const user = await User.where({name: req.params.name}).get();
          console.log(user);
          res.setStatus(200).send(user);
        } catch (error) {
          
          next(error);
        }
      }
}
