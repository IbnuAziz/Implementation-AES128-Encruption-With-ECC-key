const userMessage = require('../../main/models/usersMessage')

async function isRead() {
    await userMessage.find({
        isRead: { $in: [false]}
    })
    .exec((err, result)=>{
        if(err){
            console.log('Cannot Find isRead : ', err)
        }
    const jum = result.count();
    console.log(result)
    })
}