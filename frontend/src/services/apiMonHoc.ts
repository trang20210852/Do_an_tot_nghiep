import axios from "axios";
import { apiURL } from "./apiURL";

export type MonHoc = {
    id: number;
    tenMonHoc: string;
    noiDungMonHoc: string;
};

export async function getAllMonHoc(): Promise<MonHoc[]> {
    const response = await axios.get(apiURL.getAllMonHoc);
    console.log(response);
    const data = response.data as any[];

    return data.map((item) => {
        return {
            id: item.IDMonHoc,
            tenMonHoc: item.TenMonHoc || "Unknown",
            noiDungMonHoc: item.NoiDungMonHoc || "No Content",
        } as MonHoc;
    });
}
