import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function Report({id, accessToken, setAccessToken, refreshToken}) {
    const [reportTable, setReportTable] = useState("")

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const decodedToken = jwt_decode(accessToken);
        if (decodedToken.exp < Date.now() / 1000) {
            const res = await axios.get('http://localhost:5000/requestNewAccessToken', {
                headers: {
                    'Authorization': `Refresh ${refreshToken}`
                }
            })
            setAccessToken(res.headers['auth-token-access'])
            config.headers['auth-token-access'] = res.headers['auth-token-access']
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    );

    useEffect(() => {
        const getReport = async () => {
            const res = await axiosJWT.get(`http://localhost:3000/api/v1/report?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setReportTable(res.data)
        }
        getReport()
    }, [id])

    return (
        <>
            Report {id}
            {reportTable && reportTable}
        </>
    )
}

export default Report;