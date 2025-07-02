import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export const callPostApi = (url: string, data: any) => {
    return api.post(url, data)
}


export const callGetApi = (url: string, caching = true) => {
    return api.get(url, {
        headers: {
            ...(caching ? {} : {
                "Cache-Control": "no-store",
                Pragma: "no-cache",
                Expires: "0",
            }),

        },

    })
}

export const callDeleteApi = (url: string) => {
    return api.delete(url)
}


export const callPutApi = (url: string, data: any) => {
    return api.put(url, data)
}