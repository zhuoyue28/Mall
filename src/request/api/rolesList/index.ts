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


// 角色列表
export const roleList = (data: any): Res<any> =>
    request.post("/role/list", data);
// 修改角色状态
export const roleUpdateStatus = (data: any): Res<any> =>
    request.post("/role/updateStatus", data);
// 角色删除
export const roleDeleteRole = (data: any): Res<any> =>
    request.post("/role/deleteRole", data);
// 角色添加
export const roleStore = (data: any): Res<any> =>
    request.post("/role/store", data);
// 角色编辑
export const roleUpdate = (data: any): Res<any> =>
    request.post("/role/update", data);
