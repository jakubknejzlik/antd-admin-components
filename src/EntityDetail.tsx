import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Card, CardProps, Result, Space, Spin } from 'antd';
import { Link } from 'react-router-dom';

interface EntityDetailProps<TData> extends CardProps {
  data?: TData;
  loading?: boolean;
  error?: Error;
  card?: CardProps;
}

export const EntityDetail = <TData extends { [key: string]: any } = any>(
  props: EntityDetailProps<TData>
) => {
  const { data, loading, error, children, extra, ...rest } = props;

  return (
    <Card
      loading={loading}
      {...rest}
      extra={
        <Space>
          {extra}
          <Link to="edit">
            <Button size="small" disabled={loading || !data}>
              <EditOutlined />
            </Button>
          </Link>
        </Space>
      }
    >
      {error && <Alert type="error" message={error?.message} />}
      {loading && <Spin style={{ width: '100%' }} />}
      {!loading && !data && (
        <Result
          status={'404'}
          title="Not found"
          subTitle="No item was found on this page"
        />
      )}
      {data && children}
    </Card>
  );
};
