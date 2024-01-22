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


// 管理员列表
export const adminList = (data: any): Res<any> =>
    request.post("/admin/list", data);
// 管理员详情
export const adminFindData = (data: any): Res<any> =>
    request.post("/admin/findData", data);
// 管理员修改开关
export const adminUpdateStatus = (data: any): Res<any> =>
    request.post("/admin/updateStatus", data);