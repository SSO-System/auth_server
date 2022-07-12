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
    await Account.add({
        username: value.username,
        password: value.password,
        email: "metalicn20@gmail.com",
        emailVerified: false,
    })
}
