"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReportDbRepository = void 0;
const postReportDbRepository = (repository) => {
    const submitPostReport = async (postReportEntity) => await repository.submitPostReport(postReportEntity);
    const getNumberOfPostReports = async () => await repository.getNumberOfPostReports();
    const getReports = async () => await repository.getReports();
    return {
        submitPostReport,
        getReports,
        getNumberOfPostReports
    };
};
exports.postReportDbRepository = postReportDbRepository;
