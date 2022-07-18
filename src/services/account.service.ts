import { Account } from "../db/firestore/models/Account";

export const get = async (username: string) => {
    const doc: any = await Account.where('username', '==', username).get();
    if (doc.empty) {
        return undefined;
    } else {
        const user_info = doc.docs[0].data();
        user_info.id = doc.docs[0].id;
        return user_info;
    }
}

export const update = async (id: string, data: any) => {
    return await Account.doc(id).update(data);
}

export const set = async (username: string, value: any) => {
    console.log(value)
    await Account.add({
        username: value.username,
        password: value.password,
        email: value.email,
        email_verified: false,
        firstname: value.firstname,
        lastname: value.lastname,
        birthdate: value.birthdate,
        gender: value.gender,
        picture: "https://firebasestorage.googleapis.com/v0/b/oauth2-c28ca.appspot.com/o/avatar%2Fdefault_picture.jpg?alt=media&token=bbd9a270-6ed9-4e70-92cb-2aa12713439c",

    })
}
