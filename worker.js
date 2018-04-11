require('dotenv').config();
const express = require('express');
const app = express();
const config = require('./src/config/config');
const queue = require('./src/jobs/queue');
const contentfulImageUploadJob = require('./src/jobs/contentfulImageUploadJob');

const q = queue.createQueue();

q.process('contentful', 5, (job, done) => {
    switch (job.data.code){
        case config.CONTENTFUL_IMAGE_UPLOAD_JOB:
        contentfulImageUploadJob.processJob(job, done);
        break;
    }
});