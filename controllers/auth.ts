import { User } from "../models/User.ts";
import {
  Request,
  Response,
  ParamsDictionary,
  NextFunction,
  Model,
} from "../utils/deps.ts";

export default {
  login: async (
    req: Request<ParamsDictionary, any, any>,
    res: Response<any>,
    next: NextFunction
  ) => {
    const userName = req.query.user;
    const pass = req.query.password;
    // NOTE: This can be just a Model too, I guess. Watch out for that.
    let results = await User.where({ name: userName, password: pass }).get();
    results = results as Model[]

    if (results.length > 0) {
      res.setStatus(200).send(results[0].name);
    } else {
      res.setStatus(404).send();
    }
  },
};
