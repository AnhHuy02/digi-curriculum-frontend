import axios, { AxiosResponse } from 'axios';

export const getData = async function (url: string, params: any) {
  const res: AxiosResponse = await axios.get(url, { params });
  return res;
};

export const postData = async function (
  url: string,
  params: any,
  config: any = {}
) {
  const res: AxiosResponse = await axios.post(url, params, config);
  return res;
};

export const putData = async function (
  url: string,
  params: any,
  config: any = {}
) {
  const res: AxiosResponse = await axios.put(url, params, config);
  return res;
};

export const deleteData = async function (url: string, params: any) {
  const res: AxiosResponse = await axios.delete(url, { params });
  return res;
};
