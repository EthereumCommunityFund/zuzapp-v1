import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; import { Database } from "@/database.types";
import { NextApiRequest, NextApiResponse } from "next";
import { validateUUID } from "@/validators";
import handler from "../eventspace";
import { string } from "joi";
import { logToFile } from "@/utils/logger";
import { permissionConfig } from "@/utils/permissions";
import pathToRegexp from 'path-to-regexp';
type Permissions = "creator" | "collaborator"
import UrlPattern from 'url-pattern';




const withAuthorization = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const { event_space_id, id } = req.query
        const errors = validateUUID(event_space_id);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }



        const routeConfigKey = Object.keys(permissionConfig).find((pattern) => {
            console.log(pattern)
            const regex = new UrlPattern(pattern);
            console.log("req.url", req.url?.split("?event_space_id")[0])
            let url = req.url?.split("?event_space_id")[0]
            return regex.match(url as string)
        });




        const routeConfig = routeConfigKey ? permissionConfig[routeConfigKey] : null;

        if (!routeConfig) {
            return res.status(403).send("Access forbidden");
        }


        const supabase = createPagesServerClient<Database>({ req, res });
        console.log(routeConfig, "route config")
        const isAuthorized = await routeConfig.verify(supabase, req, routeConfig.allowedUsers);

        if (!isAuthorized) {
            return res.status(403).send("You are not authorized");
        }

        return handler(req, res)
    }

}




export default withAuthorization