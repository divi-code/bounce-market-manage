import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { EditFilled, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Space, Tooltip, Typography, Modal, Switch } from 'antd';
import { getDrops, deleteOneDrop, closeOneDrop, hideOneDrop, showOneDrop } from '@/services/drops';
import type { DropsState, IDropsResponse } from '@/services/drops/types';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'umi';
import Image from '@/components/Image';

const { confirm } = Modal;

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  reset: () => void;
  clearSelected?: () => void;
  startEditable: (rowKey: any) => boolean;
  cancelEditable: (rowKey: any) => boolean;
}

const tabs = [
  {
    tab: 'Coming soon',
    key: 1,
  },
  {
    tab: 'Live',
    key: 2,
  },
  {
    tab: 'Previous',
    key: 3,
  },
];

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
}

const DropsPage: React.FC = () => {
  const [state, setState] = useState<DropsState>(1);

  const ref = useRef<ActionType>();

  const handleDelete = (dropsid: number) => {
    confirm({
      title: <span style={{ fontSize: 14 }}>{'Delete Drop'}</span>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span style={{ fontSize: 20 }}>{'Are you sure you want to delete this Drop？'}</span>
          <span style={{ fontSize: 20, color: 'red' }}>{'This operation cannot be undone.'}</span>
        </>
      ),
      onOk() {
        deleteOneDrop(dropsid).then((res) => {
          if (res.code === 1) {
            message.success('Deleted Successfully');
            ref?.current?.reload();
          }
        });
      },
    });
  };

  const handleCloseDrop = (dropId: number) => {
    confirm({
      title: <span style={{ fontSize: 14 }}>{'Close Drop'}</span>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span style={{ fontSize: 20 }}>{'Are you sure you want to close this Drop？'}</span>
          <span style={{ fontSize: 20, color: 'red' }}>{'This operation cannot be undone.'}</span>
        </>
      ),
      onOk() {
        closeOneDrop(dropId).then((res) => {
          if (res.code === 1) {
            message.success('Closed Successfully');
            ref?.current?.reload();
          }
        });
      },
    });
  };

  const handleChangeDropDisplay = (dropId: number, targetState: 'show' | 'hide') => {
    confirm({
      title: <span style={{ fontSize: 14 }}>{'Close Drop'}</span>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span
            style={{ fontSize: 20 }}
          >{`Are you sure you want to ${targetState} this Drop？`}</span>
        </>
      ),
      onOk() {
        if (targetState === 'hide')
          hideOneDrop(dropId).then((res) => {
            if (res.code === 1) {
              message.success('This drop has been hidden.');
              ref?.current?.reload();
            }
          });
        else
          showOneDrop(dropId).then((res) => {
            if (res.code === 1) {
              message.success('This drop is on display.');
              ref?.current?.reload();
            }
          });
      },
    });
  };

  const columns: ProColumns<IDropsResponse>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'coverimgurl',
      title: 'Cover',
      render: (src: any, record) => {
        if (src === '-')
          return <div style={{ backgroundColor: record.bgcolor, width: 40, height: 40 }}></div>;
        return <Image width={40} height={40} src={src} />;
      },
    },
    {
      dataIndex: 'title',
      title: 'Title',
      width: 100,
    },
    {
      dataIndex: 'accountaddress',
      title: 'Artist Account',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },

    {
      dataIndex: 'nfts',
      title: 'Items',
    },
    {
      dataIndex: 'dropdate',
      title: 'Drop Date',
      render: (ts: any) => {
        return moment(ts * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: 'Action',
      dataIndex: 'operact',
      width: 100,
      render(_, item) {
        return (
          <Space>
            {state === 2 && (
              <Button
                danger
                onClick={() => {
                  handleCloseDrop(item.id);
                }}
              >
                Close Drop
              </Button>
            )}
            <Link to={`/drops/edit/?id=${item.id}`}>
              <Button icon={<EditFilled />} />
            </Link>
            {state === 1 && (
              <Button
                danger
                onClick={() => {
                  handleDelete(item.id);
                }}
              >
                Delete
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (state === 2 || state === 3)
    columns.push({
      title: 'Hide Creation',
      width: 100,
      render(_, item) {
        return (
          (state === 2 || state === 3) && (
            <Switch
              checkedChildren="hiden"
              unCheckedChildren="show"
              checked={item.display === 2}
              onChange={(checked) => {
                if (checked) handleChangeDropDisplay(item.id, 'hide');
                else handleChangeDropDisplay(item.id, 'show');
              }}
            />
          )
        );
      },
    });

  return (
    <PageContainer
      onTabChange={(key: any) => {
        setState(Number(key) as DropsState);
      }}
      tabList={tabs}
      tabBarExtraContent={[
        <Link key="add" to="/drops/edit">
          <Button icon={<PlusOutlined />} type="primary">
            Add
          </Button>
        </Link>,
      ]}
    >
      <ProTable
        actionRef={ref as any}
        rowKey="id"
        search={false}
        columns={columns}
        params={{ state }}
        request={async ({ pageSize: limit, current: offset, ...rest }) => {
          const { data, total } = await getDrops({
            offset,
            limit,
            ...rest,
          });
          return {
            success: true,
            total,
            data,
          };
        }}
        options={{
          search: {
            style: { width: 300 },
            name: 'accountaddress',
            placeholder: 'Input address',
          },
        }}
      ></ProTable>
    </PageContainer>
  );
};

export default DropsPage;
