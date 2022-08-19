import React from 'react';
import {
  Alert,
  Button,
  Card,
  CardProps,
  Form,
  message,
  Result,
  Spin,
} from 'antd';
import { useState } from 'react';
// import { useLocation } from "react-router-dom";

interface EntityEditFormProps<TData> {
  data?: TData;
  loading?: boolean;
  error?: Error;
  card?: CardProps;

  children: React.ReactNode;

  onFinish: (values: TData) => Promise<any>;
}

export const EntityEditForm = <TData extends object = any>(
  props: EntityEditFormProps<TData>
) => {
  const { data, loading, error, children, card, onFinish } = props;
  const [saving, setSaving] = useState(false);
  // const navigate = useNavigate();
  // const loc = useLocation();

  return (
    <Card title="Edit" loading={loading} {...card}>
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
              // navigate(resolvePath(`../`, loc.pathname));
            } catch (err) {
              message.error(err.message);
            } finally {
              setSaving(false);
            }
          }}
        >
          {children}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
