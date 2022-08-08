import React from 'react';

import { Button } from 'antd';
import { ReactNode } from 'react';
import { generatePath, Link } from 'react-router-dom';

export interface ButtonLinkProps {
  link?: string;
  icon?: ReactNode;
}

export const ButtonLink = ({
  link,
  icon,
  defaultLink,
  defaultIcon,
  params,
}: ButtonLinkProps & {
  defaultLink: string;
  defaultIcon: ReactNode;
  params?: { [key: string]: any };
}) => {
  const to = generatePath(link || defaultLink, params);
  return (
    <Link to={to}>
      <Button size="small">{icon || defaultIcon}</Button>
    </Link>
  );
};
