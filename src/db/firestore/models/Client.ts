import { db } from '../connection';

export const Client = db.collection('oidcmodel').doc('This_collection_must_have_just_one_document').collection('Client');