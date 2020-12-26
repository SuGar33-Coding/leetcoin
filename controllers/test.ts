import { Response, Request } from "https://deno.land/x/opine@1.0.0/src/types.ts";

export function thing(req: Request, res: Response) {
    res.send(req.hostname);
}