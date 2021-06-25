import React from 'react';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Modal,
  Table,
  Tag,
  Space,
  Switch,
  Select,
  Avatar,
  Image,
  Tooltip,
  Button,
  Card,
  message,
  Input,
  Row,
  Col,
  Statistic,
} from 'antd';
import { useRequest } from 'umi';
import request from 'umi-request';

const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;

const { Column, ColumnGroup } = Table;

import placeholderImg from '@/assets/images/placeholderImg.svg';
interface IAccountData {
  id: number;
  bounceid: number;
  email: string;
  bandimgurl: string;
  accountaddress: string;
  username: string;
  fullnam: string;
  bio: string;
  imgurl: string;
  created_at: string;
  updated_at: string;
}

const getAccountList = function (likename: string = '', offset: number, limit: number = 7) {
  return request.post('/api/bouadmin/main/auth/getaccountsbylikename', {
    data: {
      likename,
      limit,
      offset,
    },
  });
};

const handleDeleteAccount = async function (id: number, reload: () => void) {
  const deleteAccount = async (id: number) => {
    const res = await request.post('/api/bouadmin/main/auth/delaccount', {
      data: {
        id,
      },
    });
    if (res.code === 1) {
      message.success('Deleted successfully');
    } else {
      message.error('Delete failed');
    }
  };

  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: 'Do you Want to delete this item?',
    onOk() {
      deleteAccount(id).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

// function showPromiseConfirm(value: string) {
//   confirm({
//     title: `Do you want to ${value} these items?`,
//     icon: <ExclamationCircleOutlined />,
//     content: 'When clicked the OK button, this dialog will be closed after 1 second',
//     onOk() {
//       return new Promise((resolve, reject) => {
//         setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
//       }).catch(() => console.log('Oops errors!'));
//     },
//     onCancel() {},
//   });
// }

const index: React.FC = () => {
  const {
    // data: itemData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: accountTableProps,
    run: searchAccount,
    refresh: reloadAccount,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getAccountList(searchText, (offset - 1) * limit, limit);
    },
    {
      paginated: true,
      cacheKey: 'accounts',
      defaultParams: [{ pageSize: 7, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="NFTs on sale" value={256568} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="NFTs generated" value={256568} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="Total wallets(accounts)" value={112893} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="volumn (24h)" value={112893} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="volumn" value={112893} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default index;
