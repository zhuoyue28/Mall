import request from "@/request/index"

// Res是返回的参数，T是泛型，需要自己定义，返回对数统一管理***
type Res<T> = Promise<ItypeAPI<T>>;
// 一般情况下响应数据返回的这三个参数，
// 但不排除后端返回其它的可能性，
interface ItypeAPI<T> {
    data: T,//请求的数据，用泛型
    message: string | null // 返回状态码的信息，如请求成功等
    code: number //返回后端自定义的200，404，500这种状态码
}


// 活动列表
export const activityList = (data: any): Res<any> =>
    request.post("/activity/list", data);
// 活动发布/取消发布
export const activitySetStatus = (data: any): Res<any> =>
    request.post("/activity/setStatus", data);
// 活动删除
export const activityDel = (data: any): Res<any> =>
    request.post("/activity/del", data);
// 活动上传文件
export const comUploadeFile = (data: any): Res<any> =>
    request.post("/com/uploadeFile", data);
// 活动添加/编辑
export const activityAddOrEdit = (data: any): Res<any> =>
    request.post("/activity/addOrEdit", data);
// 活动详情
export const activityDetails = (data: any): Res<any> =>
    request.post("/activity/details", data);
// 优惠券列表
export const couponSelectList = (data: any): Res<any> =>
    request.post("/coupon/selectList", data);
