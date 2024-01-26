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


// 店铺列表
export const storeList = (data: any): Res<any> =>
    request.post("/store/list", data);
// 店铺删除
export const storeDel = (data: any): Res<any> =>
    request.post("/store/del", data);
// 店铺添加/编辑
export const storeAddOrEdit = (data: any): Res<any> =>
    request.post("/store/addOrEdit", data);
// 店铺详情
export const storeDetails = (data: any): Res<any> =>
    request.post("/store/details", data);

