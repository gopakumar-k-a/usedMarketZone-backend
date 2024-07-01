import { PostReportEntityType } from "../../entities/createPostReportEntity";
import { PostReportRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/postReportRepositoryMongoDb";

export const postReportDbRepository=(repository:ReturnType<PostReportRepositoryMongoDb>)=>{

    const submitPostReport =async (postReportEntity:PostReportEntityType) =>await repository.submitPostReport(postReportEntity)
     return {
        submitPostReport
     }
}


export type PostReportDbRepository = ReturnType<typeof postReportDbRepository>;

export type PostReportDbInterface=typeof postReportDbRepository