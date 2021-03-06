require('dotenv').config();
const express = require('express');
const app = express();
const config = require('./src/config/config');
const queue = require('./src/jobs/queue');
const contentfulImageUploadJob = require('./src/jobs/contentfulImageUploadJob');
const contentfulImageDeleteJob = require('./src/jobs/contentfulImageDeleteJob');

const q = queue.createQueue();
q.on('job failed', (jobId, err) => {
    console.log(`Job ${jobId} fail with error: ${JSON.stringify(err)}`);
    kue.Job.get(jobId, (err, job) => {
        if (err) {
            console.log(`error getting job with ID: ${jobId}`);
            return;
        }
        job.remove()
    });
});

q.watchStuckJobs();

q.process('contentful', 5, (job, done) => {
    switch (job.data.code){
        case config.CONTENTFUL_IMAGE_UPLOAD_JOB:
            contentfulImageUploadJob.processJob(job, done);
            break;
        case config.CONTENTFUL_IMAGE_DELETE_JOB:
            contentfulImageDeleteJob.processJob(job, done);
            break;
        default:
            const err = "Error: unknown job type"
            console.log(err);
            done(err);
    }
});