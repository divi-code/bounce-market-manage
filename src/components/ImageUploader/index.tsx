import React, { useEffect } from 'react';
import { message, Upload } from 'antd';
// import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import type { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.min.css';
import { fileUploader } from '@/services/uploader';

const SupportedImgType = ['image/jpg', 'image/png', 'image/gif', 'image/jp2', 'image/jpeg'];

export interface IImageUploaderProps {
  value?: UploadFile;
  maxCount?: number;
  limit?: number;
  onChange: (file: UploadFile | null, items: UploadFile[]) => void;
}
const ImageUploader: React.FC<IImageUploaderProps> = ({
  value,
  onChange,
  limit,
  maxCount = 10,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (value) {
      setFileList([value]);
    }
  }, [value]);

  const handleChange = ({ file, fileList: newFileList }: UploadChangeParam) => {
    // console.log('file: ', file);
    if (!file.status) return;
    if (!SupportedImgType.find((supportedType) => supportedType === file.type)) {
      message.error(`Only support jpg, png, gif, jpeg, jp2`);
      return;
    }
    setFileList(newFileList);
    switch (file.status) {
      case 'done':
        onChange(file, fileList);
        break;
      case 'removed':
        onChange(null, fileList);
        break;
      default:
        break;
    }
  };

  const handleBeforeUpload = async (file: RcFile) => {
    const size = file.size || 0;
    if (limit && size > limit) {
      message.error(`Image must smaller than ${limit / 1024 / 1024}M`);
      return false;
    }
    // setLoading(true);
    const formData = new FormData();
    formData.append('filename', file);
    const res = await fileUploader(formData);
    // eslint-disable-next-line no-param-reassign
    file.url = res.result?.path;
    // setLoading(false);
    return Promise.resolve();
  };

  return (
    // <ImgCrop rotate>
    <Upload
      maxCount={maxCount}
      listType="picture-card"
      accept=".jpg, .png, .gif, .jpeg, .jp2,"
      showUploadList={{ showPreviewIcon: false }}
      beforeUpload={handleBeforeUpload}
      onChange={handleChange}
      fileList={fileList}
    >
      {maxCount > fileList.length ? <PlusOutlined /> : null}
    </Upload>
    // </ImgCrop>
  );
};

export default ImageUploader;
