import React, { ReactNode, useState } from 'react';
// import './AppLayout.css';

// import '@aws-amplify/ui-react/styles.css';
import { Breadcrumb, Layout, Menu, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import {
  Link,
  matchPath,
  Params,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

type StructureContent =
  | React.ReactElement
  | ((params: Readonly<Params<string>>) => React.ReactElement);

export interface Structure {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content?: StructureContent;
  children?: Structure[];
  hidden?: boolean;
}

function processItems(items: Structure[], path = ''): Structure[] {
  return [
    ...items
      .filter(i => !i.hidden)
      .map(i => {
        const key = `${path}${i.key}`;
        const children = i.children && processItems(i.children, key);
        return {
          ...i,
          key,
          children: children && children.length > 0 ? children : undefined,
        } as Structure;
      }),
  ];
}

const RouteElement = (props: { content?: StructureContent }) => {
  const params = useParams();
  if (typeof props.content === 'function') {
    return props.content(params);
  }
  return <>{props.content}</>;
};

function getRoutesFromItems(items: Structure[], path = ''): React.ReactNode[] {
  let res: React.ReactNode[] = [];
  for (const item of items) {
    const p = `${path}${item.key}`;
    res.push(
      <Route
        key={p}
        path={`${p}`}
        element={<RouteElement content={item.content} />}
      />
    );
    if (item.children) {
      res = [...res, ...getRoutesFromItems(item.children, `${p}`)];
    }
  }
  res.push(<Route key={'*'} path={'*'} element={<>not found</>} />);
  return res;
}
function getBreadcrumbs(
  items: Structure[],
  pathname: string,
  parentRoutes: string[] = []
): ReactNode[] {
  let res: ReactNode[] =
    parentRoutes.length === 0
      ? [
          <Breadcrumb.Item key="home">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>,
        ]
      : [];

  for (const item of items) {
    if (!pathname) {
      continue;
    }
    const match = matchPath(
      {
        path: `${item.key}`,
        end: false,
      },
      pathname
    );
    const fullMatch = matchPath(
      {
        path: `${item.key}`,
        end: true,
      },
      pathname
    );
    if ((match !== null && item.children) || fullMatch !== null) {
      const _match = fullMatch || match;
      if (_match === null) {
        continue;
      }
      res.push(
        <Breadcrumb.Item key={`${_match.pathnameBase}`}>
          <Link to={parentRoutes.join('') + _match.pathnameBase}>
            {item.label}
          </Link>
        </Breadcrumb.Item>
      );

      if (item.children) {
        const items = getBreadcrumbs(
          item.children,
          pathname.replaceAll(_match.pathnameBase, ''),
          [...parentRoutes, _match.pathnameBase]
        );
        res.push(items);
      }
      break;
    }
  }

  return res;
}

interface AppLayoutProps {
  structure: Structure[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { structure, header, footer } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const pathnameParts = location.pathname.split('/').filter(x => x);
  const defaultOpenKeys =
    pathnameParts.length > 0
      ? pathnameParts.reduce((prev: string[], val, i) => {
          if (i === 0) {
            prev.push(`/${val}`);
          } else {
            prev.push(`${prev[prev.length - 1]}/${val}`);
          }
          return prev;
        }, [])
      : ['/'];

  const breadcrumbItems = getBreadcrumbs(structure, location.pathname);

  return (
    <Layout id="components-layout-demo-side" style={{ minHeight: '100vh' }}>
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth="0"
        // collapsible={true}
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[defaultOpenKeys[0]]}
          defaultOpenKeys={defaultOpenKeys}
          onClick={item => {
            navigate(item.key);
          }}
          items={[...processItems(structure)]}
        />
      </Layout.Sider>
      <Layout className="site-layout">
        <Layout.Header
          className="site-layout-background"
          style={{ padding: 0 }}
        >
          <Space className="antd-header-content">{header}</Space>
        </Layout.Header>
        <Layout.Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems}
          </Breadcrumb>
          <Routes>{getRoutesFromItems(structure)}</Routes>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>{footer}</Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
