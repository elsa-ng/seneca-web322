const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema ({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});

let Comment;

module.exports.initialize = () => {
    return new promise ((resolve, reject)=>{
        let db = mongoose.createConnection("mongodb://wcng1:20107771@ds135486.mlab.com:35486/web322_wcng1a6");

        db.on('error', (err)=>{
            reject(err);
        });

        db.once('open', ()=>{
            Comment = db.model("comments", commentSchema);
            resolve();
        });
    });
};

module.exports.addComment = (data) => {
    return new promise((resolve, reject)=>{
        data.postedDate = Date.now();
        let newComment = new Comment(data);

        newComment.save((err)=>{
            if(err) {
                reject('There was an error saving the comment: ${err}');
            } else {
                resolve(newComment._id);
            }
            process.exit();
        });
    });
};

module.exports.getAllComments = () => {
    return new promise((resolve, reject)=>{
        Comment.find().sort({
            postedDate: 'asc'                       // 1 is ascending
        }).exec().then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject('There was an error getting all the comments: ${err}');
        });
    });
};

module.exports.addReply = (data) => {
    return new promise((resolve, reject)=>{
        data.repliedDate = Date.now();

        Comment.update(
            {comment_id: data.comment_id},
            {$addToSet: {replies: data}},
            {multi: false}
        ).exec().then(()=>{
            resolve();
        }).catch((err)=>{
            reject('There was an error adding a reply: $(err)');
        });
    });
};