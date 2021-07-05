import React, { useState } from 'react';
import { Input, Select } from 'antd';
import styles from '../index.less'
import { UserRoleEnum, UserRoleType } from '../actions/apiType';
const { Search } = Input
const { Option } = Select

const UserTopView: React.FC<{
  onSearch: (v: string) => void;
  onRoleChange: (v: UserRoleType) => void;
  run: () => void
}> = ({ onSearch, onRoleChange, run }) => {
  return <>
    <div className={["flex flex-space-x", styles.topHandle].join(' ')}>
      <div style={{ width: '500px' }}>
        <Search
          placeholder="Input user name"
          allowClear
          onSearch={onSearch}
          size="middle"
        />
      </div>
      <Select placeholder="select user identity" onChange={onRoleChange} style={{ width: 220 }}>
        {[
          { value: '', label: 'All', key: 0 },
          { value: UserRoleEnum.Normal, label: 'Normal', key: 1 },
          { value: UserRoleEnum.Verified, label: 'Verified', key: 2 },
        ].map(({ value, label, key }) => <Option key={key} value={value}>{label}</Option>)}
      </Select>
    </div>
  </>
}

export default UserTopView