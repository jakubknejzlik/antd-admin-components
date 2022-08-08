import React from 'react';
import { Button, Card, Form, message } from 'antd';
import { useState } from 'react';
import { resolvePath, useLocation, useNavigate } from 'react-router-dom';

interface EntityCreateFormProps<TData> {
  children: React.ReactNode;
  onFinish: (values: TData) => Promise<{ id: string }>;
}

export const EntityCreateForm = <TData extends object = any>(
  props: EntityCreateFormProps<TData>
) => {
  const [saving, setSaving] = useState(false);
  const { children, onFinish } = props;
  const navigate = useNavigate();
  const loc = useLocation();

  return (
    <Card title="Create">
      <Form
        layout="vertical"
        onFinish={async values => {
          try {
            setSaving(true);
            const res = await onFinish(values);
            navigate(resolvePath(`../${res.id}`, loc.pathname));
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
    </Card>
  );
};
