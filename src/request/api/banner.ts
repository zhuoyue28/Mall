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


// banner列表
export const BannerSelectList = (data: any): Res<any> =>
    request.post("/Banner/selectList", data);
// banner详情
export const BannerFindData = (data: any): Res<any> =>
    request.post("/Banner/findData", data);
// banner添加
export const BannerAdd = (data: any): Res<any> =>
    request.post("/Banner/add", data);
// banner编辑
export const BannerUpdate = (data: any): Res<any> =>
    request.post("/Banner/update", data);
// banner删除
export const BannerDelete = (data: any): Res<any> =>
    request.post("/Banner/delete", data);


// 协议
// 协议列表
export const AgreementSelectlist = (data: any): Res<any> =>
    request.post("/Agreement/selectlist", data);
// 协议详情
export const AgreementFindData = (data: any): Res<any> =>
    request.post("/Agreement/findData", data);
// 协议详情
export const AgreementUpdate = (data: any): Res<any> =>
    request.post("/Agreement/update", data);

