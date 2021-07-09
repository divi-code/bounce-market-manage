import { Table, Typography, Tooltip, Tag } from 'antd';
import Image from '@/components/Image';
import React from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { Apis } from '@/services';
import type { IPoolResponse, poolStateType } from '@/services/drops/types';

const getPoolsByCreatorAddress = (userAddress: string, offset: number = 0, limit: number) => {
  return request.post(Apis.getauctionpoolsbyaccount, {
    data: { userAddress, offset, limit },
  });
};

interface IAddNftTableProps {
  userAddress: string;
  tempSelectedPoolList: IPoolResponse[];
  setTempSelectedPoolList: any;
  tempSelectedKeys: number[];
  setTempSelectedKeys: any;
  selectedKeys: any;
}

const AddNftTable: React.FC<IAddNftTableProps> = ({
  userAddress,
  tempSelectedPoolList,
  setTempSelectedPoolList,
  tempSelectedKeys,
  setTempSelectedKeys,
}) => {
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setTempSelectedKeys(selectedRowKeys);
    },
    onSelect: (record: IPoolResponse, selected: boolean) => {
      if (selected) {
        setTempSelectedPoolList(tempSelectedPoolList.concat(record));
      } else {
        setTempSelectedPoolList(
          tempSelectedPoolList.filter((nft) => {
            return nft.id !== record.id || nft.standard !== record.standard;
          }),
        );
      }
    },
    getCheckboxProps: (record: IPoolResponse) => ({
      disabled: record.state === 1, // Column configuration not to be checked
    }),
    preserveSelectedRowKeys: true,
    hideSelectAll: true,
    selectedRowKeys: tempSelectedKeys,
  };

  const { tableProps: nftTableProps } = useRequest(
    ({ pageSize: limit, current: offset }) => {
      return getPoolsByCreatorAddress(userAddress, (offset - 1) * limit, limit);
    },
    {
      paginated: true,
      defaultParams: [{ pageSize: 5, current: 1 }, userAddress],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      width: 80,
      render: (src: any) => <Image height={60} width={60} src={src} />,
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 100,
    },
    {
      dataIndex: 'state',
      title: 'State',
      render: (state: poolStateType) =>
        state === 0 ? <Tag color={'blue'}>live</Tag> : <Tag color={'red'}>closed</Tag>,
    },
    {
      dataIndex: 'creator',
      title: 'Artist Account',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'standard',
      title: 'Auction Type',
      render: (standard: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
          {standard === 0 ? 'Fixed Swap' : 'English Auction'}
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      {...nftTableProps}
      size="small"
      style={{ width: 800 }}
    />
  );
};

export default AddNftTable;
