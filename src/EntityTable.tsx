import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  CardProps,
  message,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from 'antd';
import { ButtonLink, ButtonLinkProps } from './ButtonLink';

interface EntityTableProps<RecordType> extends TableProps<RecordType> {
  error?: Error;
  card?: CardProps;
  onDelete?: (item: RecordType) => Promise<any>;
  buttons?: {
    create?: boolean | ButtonLinkProps;
    detail?: boolean | ButtonLinkProps;
    edit?: boolean | ButtonLinkProps;
    delete?: boolean;
  };
}

export const EntityTable = <RecordType extends object & { id: string } = any>(
  props: EntityTableProps<RecordType>
) => {
  const { buttons, card, error, children, onDelete, ...rest } = props;

  return (
    <Card
      title={card?.title}
      bodyStyle={{ padding: 0 }}
      extra={
        (!buttons || buttons.create) && (
          <ButtonLink
            defaultIcon={<PlusOutlined />}
            defaultLink="new"
            {...(buttons && typeof buttons.create !== 'boolean'
              ? buttons.create
              : null)}
          />
        )
      }
      {...card}
    >
      {error && <Alert type="error" message={error?.message} />}
      <Table size="small" rowKey="id" {...rest}>
        {children}
        {(!buttons || buttons.delete || buttons.detail || buttons.edit) && (
          <Table.Column
            align="center"
            width={20}
            title="Actions"
            render={(_, item: RecordType) => (
              <Space size={4}>
                {(!buttons || buttons.detail) && (
                  <ButtonLink
                    params={item}
                    defaultIcon={<SearchOutlined />}
                    defaultLink=":id"
                    {...(buttons && typeof buttons.detail !== 'boolean'
                      ? buttons.detail
                      : null)}
                  />
                )}
                {(!buttons || buttons.edit) && (
                  <ButtonLink
                    params={item}
                    defaultIcon={<EditOutlined />}
                    defaultLink=":id/edit"
                    {...(buttons && typeof buttons.edit !== 'boolean'
                      ? buttons.edit
                      : null)}
                  />
                )}
                {(!buttons || buttons.delete) && onDelete && (
                  <Popconfirm
                    title="Delete item?"
                    placement="topRight"
                    onConfirm={async () => {
                      try {
                        await onDelete(item);
                      } catch (err) {
                        message.error((err as Error).message);
                      }
                    }}
                  >
                    <Button size="small" danger={true}>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            )}
          />
        )}
      </Table>
    </Card>
  );
};
