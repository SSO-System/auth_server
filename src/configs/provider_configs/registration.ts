// import { nanoid } from 'nanoid'

// function idFactory(ctx) {
//     return nanoid();
//   }

//   async function secretFactory(ctx) {
//     const bytes = Buffer.allocUnsafe(64);
//     await randomFill(bytes);
//     return base64url.encodeBuffer(bytes);
//   }

// export const client_registration = {
//     enabled: false,
//     idFactory: [Function: idFactory], // see expanded details below
//     initialAccessToken: false,
//     issueRegistrationAccessToken: true,
//     policies: undefined,
//     secretFactory: [AsyncFunction: secretFactory] // see expanded details below
//   }