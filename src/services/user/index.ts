import { Apis, post, get, ToOffset } from '..';
import type { IResponse } from '../types';
import type { IGetAccountsParams, ILoginRequest, IUserItem, IUserListParma } from './types';

/**
 * 用户登录
 * @param {address,signature}
 * @returns tokens
 */
export const login = (params: ILoginRequest) => post(Apis.jwtauth, params);
/**
 * 获取用户权限
 */
export const getUserRole = (address: string) => get(Apis.getoperatorsinfo, { address });

export const getUserList = (
  { pageSize: limit, current: offset, role }: IUserListParma,
  search: string,
) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    likestr: search,
    accountaddress: search,
    filter: 2,
    limit,
    offset: ToOffset(offset, limit),
    ...(role ? { identity: role } : {}),
  });
};

export const getUserListFormatResult = (data: IResponse<IUserItem[]>) => {
  return {
    total: data.total ?? 0,
    list: data.data,
  };
};

export const defaultUserPageParams = { current: 1, pageSize: 5 };

// filter: 1:normal, 2:identity
export const getVerfiedUsersList = ({ offset, limit }: IGetAccountsParams) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    filter: 3,
    identity: 2,
    offset,
    limit,
  });
};

export const getAccountByAddress = ({ offset, limit = 5, accountaddress }: IGetAccountsParams) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    filter: 2,
    limit,
    offset,
    accountaddress,
  });
};
