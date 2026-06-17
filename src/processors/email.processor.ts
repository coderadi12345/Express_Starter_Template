import { Job, Worker  } from "bullmq";
import { NotificationDto } from "../dto/notification.dto";
import { MAILER_QUEUE } from "../queues/mailer.queue";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { getRedisConnObject } from "../config/redis.config";
import { renderMailTemplate } from "../templates/template.handlers";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";

export const setupMailerWorker = ()=>{

const emailProcessor = new Worker<NotificationDto>(

    MAILER_QUEUE,
    async(job:Job)=>{
        if(job.name !==MAILER_PAYLOAD){
            throw new Error("Invalid job name")
        }

        const payload = job.data
        console.log(`Processing Email for: ${JSON.stringify(payload)}`)

        const emailContent = await renderMailTemplate(payload.templateId , payload.params)
        await sendEmail(payload.to,payload.subject ,emailContent)

                logger.info(`Email send to ${payload.to} with subject ${payload.subject}`)

    },
    {
        connection: getRedisConnObject()
    }

)

emailProcessor.on("failed",()=>{
    console.error("Email Processing Failed")
})
emailProcessor.on("completed",()=>{
    console.log("Email Processing Completed")
})
}