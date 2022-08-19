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
  message,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from 'antd';
import { ReactNode } from 'react';
import { ButtonLink, ButtonLinkProps } from './ButtonLink';

type ActionsCellRender<RecordType> = (
  value: any,
  record: RecordType,
  index: number
) => React.ReactNode;
interface EntityTableProps<RecordType> extends TableProps<RecordType> {
  error?: Error;
  card?: {
    title?: ReactNode;
  };
  onDelete?: (item: RecordType) => Promise<any>;
  buttons?: {
    create?: boolean | ButtonLinkProps;
    detail?: boolean | ButtonLinkProps;
    edit?: boolean | ButtonLinkProps;
    delete?: boolean;
  };
  buttonsRender?: ActionsCellRender<RecordType>;
}

export const EntityTable = <RecordType extends object = any>(
  props: EntityTableProps<RecordType>
) => {
  const {
    buttons,
    card,
    error,
    children,
    onDelete,
    buttonsRender,
    ...rest
  } = props;

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
    >
      {error && <Alert type="error" message={error?.message} />}
      <Table size="small" rowKey="id" {...rest}>
        {children}
        {(!buttons || buttons.delete || buttons.detail || buttons.edit) && (
          <Table.Column
            align="center"
            width={20}
            title="Actions"
            render={(value, item: RecordType, index) => (
              <Space size={4}>
                {buttonsRender && buttonsRender(value, item, index)}
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
                      // refetch();
                    }}
                  >
                    <Button
                      size="small"
                      danger={true}
                      icon={<DeleteOutlined />}
                    />
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
