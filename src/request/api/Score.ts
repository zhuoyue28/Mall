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


// 积分添加/编辑
export const ScoreAdd = (data: any): Res<any> =>
    request.post("/Score/add", data);
// 积分详情
export const ScoreFindData = (data: any): Res<any> =>
    request.post("/Score/findData", data);
// 积分审核列表
export const pointList = (data: any): Res<any> =>
request.post("/point/list", data);
// 积分审核拒绝
export const pointRefuse = (data: any): Res<any> =>
request.post("/point/refuse", data);
// 积分审核同意
export const pointAgree = (data: any): Res<any> =>
request.post("/point/agree", data);

