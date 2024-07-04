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


// 用户列表
export const userList = (data: any): Res<any> =>
    request.post("/user/list", data);
// 用户详情
export const userDetails = (data: any): Res<any> =>
    request.post("/user/details", data);
// 用户备注
export const userRemark = (data: any): Res<any> =>
    request.post("/user/remark", data);
// 用户订单详情
export const userOrderList = (data: any): Res<any> =>
    request.post("/user/userOrderList", data);
// 用户积分记录
export const userScoreRecordList = (data: any): Res<any> =>
    request.post("/user/userScoreRecordList", data);
// 用户停车券记录
export const userCouponCarList = (data: any): Res<any> =>
    request.post("/user/userCouponCarList", data);
