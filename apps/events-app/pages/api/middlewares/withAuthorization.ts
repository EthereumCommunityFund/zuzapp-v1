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




const withAuthorization = (permission: Permissions, handler: NextApiHandler) => {
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

        // console.log(routeConfigKey, "route to config key");



        const routeConfig = routeConfigKey ? permissionConfig[routeConfigKey] : null;

        if (!routeConfig) {
            return res.status(403).send("Access forbidden");
        }
        // console.log(routeConfig, "route config")


        const supabase = createPagesServerClient<Database>({ req, res });
        console.log(routeConfig, "route config")
        const isAuthorized = await routeConfig.verify(supabase, req, routeConfig.allowedUsers);

        if (!isAuthorized) {
            return res.status(403).send("You are not authorized");
        }

        return handler(req, res)


        // if (permission === "creator") {
        //     // creatorAuthorization(req, res);
        //     const supabase = createPagesServerClient<Database>({ req, res });


        //     const { data, error } = await supabase
        //         .from('eventspace')
        //         .select('creator_id')
        //         .eq('id', event_space_id as string)
        //     if (error) {
        //         logToFile("server error", error?.message, error?.code, req.body?.user?.email || "Unknown user");
        //         return res.status(500).send("Internal server error");
        //     }


        //     if (!data || data.length < 1) {
        //         return res.status(404).send("Not found");
        //     }
        //     let event_space_response = data[0];
        //     if (event_space_response.creator_id !== req.body.user.id) {
        //         return res.status(403).send("You are not authorized");
        //     }
        //     return handler(req, res)
        // }

        // if (permission === "collaborator") {
        //     const supabase = createPagesServerClient<Database>({ req, res });
        //     const { data, error } = await supabase
        //         .from('eventspace')
        //         .select('creator_id')
        //         .eq('id', event_space_id as string)
        //     if (error) {
        //         logToFile("server error", error?.message, error?.code, req.body?.user?.email || "Unknown user");
        //         return res.status(500).send("Internal server error");
        //     }

        //     if (!data || data.length < 1) {
        //         return res.status(404).send("Not found");
        //     }
        //     let event_space_response = data[0];

        //     if (event_space_response.creator_id !== req.body.user.id) {
        //         // Check if the user has an accepted invitation
        //         const { data: inviteData, error: inviteError } = await supabase
        //             .from('eventspaceinvites')
        //             .select('*')
        //             .eq('event_space_id', event_space_id as string)
        //             .eq('invitee_id', req.body.user.id)
        //             .eq('status', 'accepted');

        //         if (inviteError) {
        //             logToFile("server error", inviteError.message, inviteError.code, req.body?.user?.email || "Unknown user");
        //             return res.status(500).send("Internal server error");
        //         }
        //         if (!inviteData || inviteData.length < 1) {
        //             return res.status(403).send("You are not authorized");
        //         }
        //     }
        //     return handler(req, res)
        // }
    }

}




export default withAuthorization