const kue = require('kue');
const config = require('../config/config');

const REDIS_URL = process.env.REDISCLOUD_URL || config.REDIS_URL;
let queue;

const retryDelayTime = (i) => {
    //first value dont count, 
    return [1, 60, 120, 600, 3600, 7200, 36000, 86400, 172800, 259200][i] * 1000;
}

const retryTimes = config.RETRY_ATTEMPS;

module.exports.createQueue = () => {
    if (queue) {
        return queue;
    }
    queue = kue.createQueue({
        redis: REDIS_URL,
        jobEvents: false
    });

    queue.on('job complete', (id, result) => {
        kue.Job.get(id, (err, job) => {
            if (err) {
                console.log(`Queue ${id} create error: ${err}`);
                return;
            } 
            job.remove((err) => {
                if (err) {
                    console.log(`Error removing job: ${job.id}, ${err}`);
                    return;
                }
            });
        })
    });

    return queue;
}

module.exports.createContentfulImageUploadJob = (body, file, userId) => {
    const decodedData = file.buffer.toString('base64');
    file.buffer = decodedData;
    const job = queue.create('contentful', {
        code: config.CONTENTFUL_IMAGE_UPLOAD_JOB,
        body,
        file,
        userId
    })
    .priority('normal')
    .attempts(retryTimes)
    .backoff(retryDelayTime)
    .ttl(60*1000);

    job.save((err) => {
        if (err) {
            console.log("error creating job for contentful image upload", err);
        }
    })
}

