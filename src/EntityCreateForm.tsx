import React from 'react';
import { Button, Card, Form, message } from 'antd';
import { useState } from 'react';
// import { resolvePath, useLocation,  } from "react-router-dom";

interface EntityCreateFormProps<TData> {
  children: React.ReactNode;
  onFinish: (values: TData) => Promise<any>;
}

export const EntityCreateForm = <TData extends object = any>(
  props: EntityCreateFormProps<TData>
) => {
  const [saving, setSaving] = useState(false);
  const { children, onFinish } = props;
  // const navigate = useNavigate();
  // const loc = useLocation();

  return (
    <Card title="Create">
      <Form
        layout="vertical"
        onFinish={async values => {
          try {
            setSaving(true);
            await onFinish(values);
            // navigate(resolvePath(`../${res.id}`, loc.pathname));
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
    </Card>
  );
};
