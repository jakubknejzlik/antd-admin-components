import React from 'react';
import { Alert, Button, Card, Form, message, Result, Spin } from 'antd';
import { useState } from 'react';
import { resolvePath, useLocation, useNavigate } from 'react-router-dom';

interface EntityEditFormProps<TData> {
  data?: TData;
  loading?: boolean;
  error?: Error;

  children: React.ReactNode;

  onFinish: (values: TData) => Promise<{ id: string }>;
}

export const EntityEditForm = <TData extends object = any>(
  props: EntityEditFormProps<TData>
) => {
  const { data, loading, error, children, onFinish } = props;
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

  return (
    <Card title="Edit" loading={loading}>
      {error && <Alert type="error" message={error?.message} />}
      {loading && <Spin style={{ width: '100%' }} />}
      {!loading && !data && <Result status={'404'} />}
      {data && (
        <Form
          layout="vertical"
          initialValues={data}
          onFinish={async values => {
            try {
              setSaving(true);
              await onFinish(values);
              navigate(resolvePath(`../`, loc.pathname));
            } catch (err) {
              message.error((err as Error).message);
            } finally {
              setSaving(false);
            }
          }}
        >
          {children}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={saving}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
