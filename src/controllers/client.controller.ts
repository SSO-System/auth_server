
import { Middleware } from "koa";
import * as clientService from "../services/client.service";

export default (): { [key: string]: Middleware } => ({
 
//   register: async (ctx) => {
//     const body = ctx.request.body;
//     await accountService.set(body.username, {
//       username: body.username,
//       password: body.password,
//     });
//     ctx.body = { message: "User successfully created"};
//   },

  client_form: async (ctx) => {
    return ctx.render("clientRegister", {
      authServerUrl: "http://localhost:3000", title:"client register"
    });
  },

  client_registration: async (ctx) => {
    const body = ctx.request.body;
    interface Client {
      client_id: string; 
      client_secret: string;
      grant_types: string[];
      post_logout_redirect_uris: string[];
      redirect_uris: string[];
      scope: string;
      urn: string[];
    }

    const newClient: Partial<Client> = {
      client_id: '',
      client_secret: '',
      grant_types: [],
      post_logout_redirect_uris: [],
      redirect_uris: [],
      scope: '',
      urn: []
    }
    console.log(body);
    for( const item in body ) {
      
      if(item.search('post') !== -1)
      {
        let uri: string = body[item];
        newClient.post_logout_redirect_uris?.push(uri)
      }
      else if(item.search('origins') !== -1){
        let ori: string = body[item];
        newClient.urn?.push(ori)
      }
      else if(item.search('redirect_uri') !== -1){
        let ori: string = body[item];
        newClient.redirect_uris?.push(ori)
      }
      else {
        newClient[item] = body[item]
      }
    }
    
    await clientService.set(body.client_id, newClient);
    console.log("after register", newClient)
    console.log("aslf")
    ctx.body = { message: "client successfully created"};
  },

  client_delete: async (ctx) => {
    const client_id: any = ctx.request.header.client_id;
    console.log(client_id)
    const res = await clientService.remove(client_id);
    return ctx.body= { message: "deleted", res}
  }
});