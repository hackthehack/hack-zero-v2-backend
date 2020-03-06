const mongoose = require("mongoose");
// const HackModel = require("./model/hack");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

/**
 * Lists all Hacks currently stored in the database
 * @param {*} event 
 * @param {*} context 
 */
export const list = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    if(conn == null){
        conn = await mongoose.createConnection(url,{bufferCommands:false,bufferMaxEntries:0});
    }
    conn.model(
        "Hack",
        new mongoose.Schema({ title: String, description: String, goal: String })
      );
    const Query = conn.model('Hack');
    /**
     * To be used in the future This will return One document
     * const doc = await Query.findOne({_id: '5e6094446a56971ad6a32d7b'});
     */
    const doc = await Query.find();
    return {
        statusCode: 200,
        body: JSON.stringify(doc)
    };
};