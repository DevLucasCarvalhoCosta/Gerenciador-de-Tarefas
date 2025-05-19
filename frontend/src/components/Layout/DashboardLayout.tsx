import React, { useState } from 'react';
import { Layout, ConfigProvider, theme as antdTheme } from 'antd';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import SideMenu from './SideMenu';
import HeaderBar from './HeaderBar';
import styles from '../../styles/DashboardLayout.module.css';

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
  const { theme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const wrapperClass = theme === 'dark' ? styles.darkWrapper : styles.lightWrapper;

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout className={wrapperClass}>
        <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Layout className={styles.mainLayout}>
          <HeaderBar onMenuClick={() => setDrawerOpen(true)} />
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardLayout;
