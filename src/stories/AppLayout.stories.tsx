import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AppLayout } from '..';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta = {
  title: 'Layout',
  component: AppLayout,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => (
  <BrowserRouter>
    <AppLayout
      structure={[
        // this is for support Storybook default page
        {
          key: '/iframe.html',
          label: 'Dashboard',
          hidden: true,
          content: <>welcome on dashboard</>,
        },
        {
          key: '/',
          label: 'Dashboard',
          content: <>welcome on dashboard</>,
        },
        {
          key: '/page1',
          label: 'Page 1',
          content: <>Page 1</>,
          children: [
            { key: '/subpage', label: 'Sub page', content: <>Subpage</> },
          ],
        },
        { key: '/page2', label: 'Page 2', content: <>Page 1</> },
      ]}
      {...args}
    />
  </BrowserRouter>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
