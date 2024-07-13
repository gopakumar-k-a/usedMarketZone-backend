import { PostReportEntityType } from "../../entities/createPostReportEntity";
import { PostReportRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/postReportRepositoryMongoDb";

export const postReportDbRepository=(repository:ReturnType<PostReportRepositoryMongoDb>)=>{

    const submitPostReport =async (postReportEntity:PostReportEntityType) =>await repository.submitPostReport(postReportEntity)
    
  const getReports = async () =>await repository.getReports()
     return {
        submitPostReport,
        getReports
     }
}


export type PostReportDbRepository = ReturnType<typeof postReportDbRepository>;

export type PostReportDbInterface=typeof postReportDbRepository