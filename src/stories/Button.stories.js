
import React from 'react';
import MyButton from '../components/Button';

export default {
  title: 'Example/MyButton',
  component: MyButton,
  argTypes: {
    onClick: { action: 'clicked' },
    label: { control: 'text' },
    variant: { control: 'radio', options: ['contained', 'outlined', 'text'] },
  },
};

const Template = (args) => <MyButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Click Me',
};
