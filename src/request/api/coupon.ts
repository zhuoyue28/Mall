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


// 优惠卷列表
export const couponList = (data: any): Res<any> =>
    request.post("/coupon/list", data);
// 优惠卷添加
export const couponAdd = (data: any): Res<any> =>
    request.post("/coupon/add", data);
// 优惠卷上下架
export const couponSetStatus = (data: any): Res<any> =>
    request.post("/coupon/setStatus", data);
// 优惠卷删除
export const couponDel = (data: any): Res<any> =>
    request.post("/coupon/del", data);
// 优惠卷详情
export const couponDetails = (data: any): Res<any> =>
    request.post("/coupon/details", data);
// 优惠卷编辑
export const couponEdit = (data: any): Res<any> =>
    request.post("/coupon/edit", data);
// 生成优惠券兑换码
export const couponcreateCode = (data: any): Res<any> =>
    request.post("/coupon/createCode", data);
// 兑换记录
export const couponCodeList = (data: any): Res<any> =>
    request.post("/coupon/codeList", data);


