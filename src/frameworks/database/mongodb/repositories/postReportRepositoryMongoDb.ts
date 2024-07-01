import PostReport from "../models/postReportModel";
import { PostReportEntityType } from "../../../../entities/createPostReportEntity";
export const postReportRepositoryMongoDb = () => {
  const submitPostReport = async(postReportEntity:PostReportEntityType) => {


    const existingReportByUserOnPost=await PostReport.findOne({reporterId:postReportEntity.getReporterId(),postId:postReportEntity.getPostId()})

    console.log('existingReportByUserOnPost ',existingReportByUserOnPost);
    if(existingReportByUserOnPost){
      return 'exists'
    }
    
    const postReportData={
      reporterId:postReportEntity.getReporterId(),
      postId:postReportEntity.getPostId(),
      reason:postReportEntity.getReason(),
      reasonType:postReportEntity.getReasonType()
    }
    const newPostReport=new PostReport(postReportData)
    await newPostReport.save()



    console.log('postReportData ',postReportData);
    console.log('newPostReport ',newPostReport);

    return newPostReport
    
  };

  return {
    submitPostReport
  }
};

export type PostReportRepositoryMongoDb=typeof postReportRepositoryMongoDb
