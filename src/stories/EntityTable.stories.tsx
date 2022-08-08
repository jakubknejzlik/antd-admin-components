import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { EntityTable } from '../EntityTable';
import { Button, Table } from 'antd';

const initData = [{ id: 'aa', name: 'bb' }];

const EntityTableDemo = () => {
  const [data, setData] = useState(initData);
  return (
    <BrowserRouter>
      <EntityTable
        dataSource={data}
        card={{
          extra: (
            <Button
              size="small"
              onClick={() => {
                const count = data.length.toString();
                setData([...data, { id: count, name: `Item ${count}` }]);
              }}
            >
              +
            </Button>
          ),
        }}
        onDelete={async value => {
          setData(data.filter(i => i.id !== value.id));
        }}
      >
        <Table.Column dataIndex={'id'} title="ID" />
        <Table.Column dataIndex={'name'} title="Name" />
      </EntityTable>
    </BrowserRouter>
  );
};

const meta: Meta = {
  title: 'EntityTable',
  component: EntityTableDemo,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => {
  return <EntityTableDemo {...args} />;
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
